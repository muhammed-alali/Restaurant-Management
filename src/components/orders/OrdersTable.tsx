'use client';

import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Order, OrderStatus } from '@/types';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintOrder?: (order: Order) => void;
}

export function OrdersTable({
  orders,
  loading,
  onViewOrder,
  onUpdateStatus,
  onPrintOrder,
}: OrdersTableProps) {
  const columns: ColumnsType<Order> = [
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
      title: 'نوع الطلب',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const labels: Record<string, string> = {
          DINE_IN: 'داخل المطعم',
          TAKEAWAY: 'استلام سفري',
          DELIVERY: 'توصيل منزلي',
        };
        return <span style={{ fontWeight: 500 }}>{labels[type] || type}</span>;
      },
      width: 120,
    },
    {
      title: 'الطاولة',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (tableNum: number | null) =>
        tableNum ? (
          <span style={{ fontWeight: 600, color: '#2563EB' }}>طاولة {tableNum}</span>
        ) : (
          <span style={{ color: '#94A3B8' }}>—</span>
        ),
      width: 100,
    },
    {
      title: 'الأصناف',
      key: 'items',
      render: (_, record) => {
        const summary = record.items
          .map((i) => `${i.menuItemName} (${i.quantity})`)
          .join('، ');
        return (
          <span
            style={{
              maxWidth: 240,
              display: 'inline-block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#475569',
            }}
            title={summary}
          >
            {summary || 'لا توجد أصناف'}
          </span>
        );
      },
    },
    {
      title: 'وقت الطلب',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date | string) =>
        new Date(date).toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      width: 110,
    },
    {
      title: 'الإجمالي',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span style={{ fontWeight: 700, color: '#F06436' }}>{total} TL</span>
      ),
      width: 110,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => <StatusBadge status={status} />,
      width: 130,
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      width: 170,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="عرض التفاصيل">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewOrder(record)}
            />
          </Tooltip>

          {onPrintOrder && (
            <Tooltip title="طباعة الفاتورة">
              <Button
                size="small"
                icon={<PrinterOutlined />}
                style={{ color: '#F06436', borderColor: '#FDBA74' }}
                onClick={() => onPrintOrder(record)}
              />
            </Tooltip>
          )}

          {record.status === 'NEW' && (
            <Tooltip title="بدء التحضير">
              <Button
                size="small"
                type="primary"
                icon={<SyncOutlined />}
                style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
                onClick={() => onUpdateStatus(record.id, 'PREPARING')}
              />
            </Tooltip>
          )}

          {record.status === 'PREPARING' && (
            <Tooltip title="تحديد كجاهز">
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(record.id, 'READY')}
              />
            </Tooltip>
          )}

          {record.status === 'READY' && (
            <Tooltip title="إتمام الطلب">
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(record.id, 'COMPLETED')}
              />
            </Tooltip>
          )}

          {record.status !== 'COMPLETED' && record.status !== 'CANCELLED' && (
            <Tooltip title="إلغاء الطلب">
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onUpdateStatus(record.id, 'CANCELLED')}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
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
