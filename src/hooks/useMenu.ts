'use client';

import { useState, useEffect, useCallback } from 'react';
import { message } from '@/lib/antdMessage';
import type { MenuItem, MenuCategory } from '@/types';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory && selectedCategory !== 'ALL'
          ? `/api/menu?categoryId=${selectedCategory}`
          : '/api/menu';

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setItems(data.data.items);
        setCategories(data.data.categories);
      } else {
        message.error(data.error || 'تعذر جلب قائمة الطعام');
      }
    } catch {
      message.error('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const createItem = async (itemData: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId: string;
    isAvailable?: boolean;
  }) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تمت إضافة الوجبة بنجاح');
        await fetchMenu();
        return data.data;
      } else {
        message.error(data.error || 'فشل إضافة الوجبة');
        return null;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return null;
    }
  };

  const updateItem = async (
    id: string,
    itemData: Partial<{
      name: string;
      description: string;
      price: number;
      image: string;
      categoryId: string;
      isAvailable: boolean;
    }>,
  ) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...itemData }),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم تعديل الوجبة بنجاح');
        await fetchMenu();
        return data.data;
      } else {
        message.error(data.error || 'فشل تعديل الوجبة');
        return null;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return null;
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    return updateItem(item.id, { isAvailable: !item.isAvailable });
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  const createCategory = async (name: string) => {
    try {
      const res = await fetch('/api/menu/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        message.success('تمت إضافة التصنيف بنجاح');
        await fetchMenu();
        return data.data;
      } else {
        message.error(data.error || 'فشل إضافة التصنيف');
        return null;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return null;
    }
  };

  return {
    items: filteredItems,
    allItems: items,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refresh: fetchMenu,
    createItem,
    updateItem,
    createCategory,
    toggleAvailability,
  };
}
