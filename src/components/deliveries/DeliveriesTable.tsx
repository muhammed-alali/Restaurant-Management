'use client';

import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CarOutlined,
  CheckOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Delivery, DeliveryStatus } from '@/types';

interface DeliveriesTableProps {
  deliveries: Delivery[];
  loading: boolean;
  onUpdateStatus: (delivery: Delivery, newStatus: DeliveryStatus) => void;
}

export function DeliveriesTable({
  deliveries,
  loading,
  onUpdateStatus,
}: DeliveriesTableProps) {
  const columns: ColumnsType<Delivery> = [
    {
      title: 'رقم الطلب',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (num: number) => (
        <span style={{ fontWeight: 700, color: '#172033' }}>#{num}</span>
      ),
      width: 100,
    },
    {
      title: 'اسم العميل',
      dataIndex: 'recipientName',
      key: 'recipientName',
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <PhoneOutlined />
            <span dir="ltr">{record.phone}</span>
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: 'عنوان التوصيل',
      dataIndex: 'address',
      key: 'address',
      render: (addr: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
          <EnvironmentOutlined style={{ color: '#F06436' }} />
          <span>{addr}</span>
        </div>
      ),
    },
    {
      title: 'مندوب التوصيل',
      dataIndex: 'assignedStaffName',
      key: 'assignedStaffName',
      render: (driver: string | null) =>
        driver ? (
          <Tag color="cyan">{driver}</Tag>
        ) : (
          <span style={{ color: '#94A3B8' }}>لم يُعين بعد</span>
        ),
      width: 140,
    },
    {
      title: 'الإجمالي',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      render: (total: number) => (
        <span style={{ fontWeight: 700, color: '#F06436' }}>{total} ر.س</span>
      ),
      width: 110,
    },
    {
      title: 'حالة التوصيل',
      dataIndex: 'status',
      key: 'status',
      render: (status: DeliveryStatus) => <StatusBadge status={status} />,
      width: 140,
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'NEW' && (
            <Tooltip title="بدء التجهيز للتوصيل">
              <Button
                size="small"
                type="primary"
                style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
                onClick={() => onUpdateStatus(record, 'PREPARING')}
              >
                تجهيز
              </Button>
            </Tooltip>
          )}

          {record.status === 'PREPARING' && (
            <Tooltip title="جاهز للتوصيل">
              <Button
                size="small"
                type="primary"
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(record, 'READY_FOR_DELIVERY')}
              >
                جاهز
              </Button>
            </Tooltip>
          )}

          {record.status === 'READY_FOR_DELIVERY' && (
            <Tooltip title="خروج للتوصيل مع السائق">
              <Button
                size="small"
                type="primary"
                icon={<CarOutlined />}
                style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
                onClick={() => onUpdateStatus(record, 'OUT_FOR_DELIVERY')}
              >
                خرج للتوصيل
              </Button>
            </Tooltip>
          )}

          {record.status === 'OUT_FOR_DELIVERY' && (
            <Tooltip title="تأكيد تسليم الطلب للعميل">
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(record, 'DELIVERED')}
              >
                تم التسليم
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={deliveries}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
      }}
    />
  );
}
