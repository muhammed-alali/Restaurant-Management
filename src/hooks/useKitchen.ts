'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from '@/lib/antdMessage';
import { playNewOrderSound, primeNotificationSound } from '@/lib/notificationSound';
import type { Order, OrderStatus } from '@/types';

export function useKitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const knownOrderIdsRef = useRef<Set<string> | null>(null);

  const fetchKitchenOrders = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch('/api/kitchen');
      const data = await res.json();

      if (data.success) {
        const fetchedOrders = data.data as Order[];
        const previousIds = knownOrderIdsRef.current;

        // Only alert for orders that appeared after the first load.
        if (previousIds) {
          const hasNewOrder = fetchedOrders.some(
            (order) => order.status === 'NEW' && !previousIds.has(order.id)
          );
          if (hasNewOrder) playNewOrderSound();
        }

        knownOrderIdsRef.current = new Set(
          fetchedOrders.map((order) => order.id)
        );
        setOrders(fetchedOrders);
      }
    } catch {
      if (!isSilent) message.error('خطأ في الاتصال بالخادم');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKitchenOrders();
    // Poll kitchen orders every 5s for live synchronization
    const timer = setInterval(() => {
      fetchKitchenOrders(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchKitchenOrders]);

  // Unlock audio on the first interaction (browser autoplay policy).
  useEffect(() => {
    const unlock = () => primeNotificationSound();

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم تحديث حالة الطلب بالمطبخ');
        await fetchKitchenOrders();
        return true;
      } else {
        message.error(data.error || 'فشل تحديث حالة الطلب');
        return false;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return false;
    }
  };

  const newOrders = orders.filter((o) => o.status === 'NEW');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return {
    orders,
    newOrders,
    preparingOrders,
    readyOrders,
    loading,
    refresh: () => fetchKitchenOrders(false),
    updateStatus,
  };
}
