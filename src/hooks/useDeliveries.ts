'use client';

import { useState, useEffect, useCallback } from 'react';
import { message } from '@/lib/antdMessage';
import type { Delivery, DeliveryStatus } from '@/types';

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus && selectedStatus !== 'ALL'
          ? `/api/deliveries?status=${selectedStatus}`
          : '/api/deliveries';

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setDeliveries(data.data);
      } else {
        message.error(data.error || 'تعذر جلب طلبات التوصيل');
      }
    } catch {
      message.error('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const updateDeliveryStatus = async (
    deliveryId: string,
    newStatus: DeliveryStatus,
    assignedStaffId?: string,
  ) => {
    try {
      const res = await fetch('/api/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deliveryId, status: newStatus, assignedStaffId }),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم تحديث حالة التوصيل بنجاح');
        await fetchDeliveries();
        return true;
      } else {
        message.error(data.error || 'فشل تحديث حالة التوصيل');
        return false;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return false;
    }
  };

  const filteredDeliveries = deliveries.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      item.orderNumber.toString().includes(query) ||
      item.recipientName.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      item.address.toLowerCase().includes(query)
    );
  });

  return {
    deliveries: filteredDeliveries,
    allDeliveries: deliveries,
    loading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refresh: fetchDeliveries,
    updateDeliveryStatus,
  };
}
