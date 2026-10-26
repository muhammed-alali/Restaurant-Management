'use client';

import { useState, useEffect, useCallback } from 'react';
import { message } from '@/lib/antdMessage';
import type { RestaurantTable, TableStatus } from '@/types';

export function useTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<TableStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tables');
      const data = await res.json();

      if (data.success) {
        setTables(data.data);
      } else {
        message.error(data.error || 'تعذر جلب الطاولات');
      }
    } catch {
      message.error('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const createTable = async (tableData: { number: number; capacity: number }) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`تم إضافة الطاولة رقم ${data.data.number} بنجاح`);
        await fetchTables();
        return data.data;
      } else {
        message.error(data.error || 'فشل إضافة الطاولة');
        return null;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return null;
    }
  };

  const filteredTables = tables.filter((table) => {
    const matchesStatus =
      selectedStatus === 'ALL' || table.status === selectedStatus;
    const matchesSearch =
      !searchQuery.trim() || table.number.toString().includes(searchQuery.trim());
    return matchesStatus && matchesSearch;
  });

  return {
    tables: filteredTables,
    allTables: tables,
    loading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refresh: fetchTables,
    createTable,
  };
}
