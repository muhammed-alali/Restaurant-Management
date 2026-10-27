'use client';

import { useState, useEffect, useCallback } from 'react';
import { message } from '@/lib/antdMessage';
import type { UserRole } from '@/types';

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        message.error(data.error || 'تعذر جلب المستخدمين');
      }
    } catch {
      message.error('خطأ في الاتصال بالخادم');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (payload: {
    name: string;
    username: string;
    password: string;
    role: UserRole;
  }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم إضافة المستخدم بنجاح');
        await fetchUsers(true);
        return true;
      } else {
        message.error(data.error || 'فشل إضافة المستخدم');
        return false;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return false;
    }
  };

  const updateUser = async (
    id: string,
    payload: Partial<{
      name: string;
      username: string;
      password: string;
      role: UserRole;
    }>,
  ) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم تحديث بيانات المستخدم بنجاح');
        await fetchUsers(true);
        return true;
      } else {
        message.error(data.error || 'فشل تحديث المستخدم');
        return false;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        message.success('تم حذف المستخدم بنجاح');
        await fetchUsers(true);
        return true;
      } else {
        message.error(data.error || 'فشل حذف المستخدم');
        return false;
      }
    } catch {
      message.error('تعذر الاتصال بالخادم');
      return false;
    }
  };

  return {
    users,
    loading,
    refresh: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
