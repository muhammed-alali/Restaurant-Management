'use client';

import { useState, useEffect, useCallback } from 'react';
import { message } from '@/lib/antdMessage';
import type { Order, OrderStatus, OrderType } from '@/types';

export function useOrders(initialStatus?: OrderStatus) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus && selectedStatus !== 'ALL'
          ? `/api/orders?status=${selectedStatus}`
          : '/api/orders';

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        message.error(data.error || 'تعذر جلب الطلبات');
      }
    } catch (err) {
      message.error('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`تم تحديث حالة الطلب`);
        await fetchOrders();
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

  const createOrder = async (orderData: {
    type: OrderType;
    tableId?: string;
    notes?: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
  }) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`تم إنشاء الطلب رقم #${data.data.orderNumber} بنجاح`);
        await fetchOrders();
        return data.data;
      } else {
        message.error(data.error || 'فشل إنشاء الطلب');
        return null;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return null;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const orderNumMatch = order.orderNumber.toString().includes(query);
    const tableMatch = order.tableNumber?.toString().includes(query) ?? false;
    const itemMatch = order.items.some((i) =>
      i.menuItemName.toLowerCase().includes(query),
    );
    return orderNumMatch || tableMatch || itemMatch;
  });

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refresh: fetchOrders,
    updateOrderStatus,
    createOrder,
  };
}
