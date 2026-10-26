'use client';

import React from 'react';
import styled from 'styled-components';
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
} from '@ant-design/icons';
import type { OrderStatus, TableStatus, DeliveryStatus } from '@/types';

type AnyStatus = OrderStatus | TableStatus | DeliveryStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  type?: 'order' | 'table' | 'delivery';
  className?: string;
}

const statusConfig: Record<
  AnyStatus,
  { label: string; bg: string; color: string; border: string; icon?: React.ReactNode }
> = {
  // Order & Kitchen
  NEW: {
    label: 'جديد',
    bg: '#FFFBEB',
    color: '#B45309',
    border: '#FDE68A',
    icon: <ClockCircleOutlined />,
  },
  PREPARING: {
    label: 'قيد التحضير',
    bg: '#EFF6FF',
    color: '#1D4ED8',
    border: '#BFDBFE',
    icon: <SyncOutlined spin />,
  },
  READY: {
    label: 'جاهز',
    bg: '#F0FDF4',
    color: '#15803D',
    border: '#BBF7D0',
    icon: <CheckCircleOutlined />,
  },
  COMPLETED: {
    label: 'مكتمل',
    bg: '#F8FAFC',
    color: '#475569',
    border: '#E2E8F0',
    icon: <CheckCircleOutlined />,
  },
  CANCELLED: {
    label: 'ملغي',
    bg: '#FEF2F2',
    color: '#B91C1C',
    border: '#FECACA',
    icon: <CloseCircleOutlined />,
  },

  // Table
  AVAILABLE: {
    label: 'متاحة',
    bg: '#F0FDF4',
    color: '#15803D',
    border: '#BBF7D0',
    icon: <CheckCircleOutlined />,
  },
  OCCUPIED: {
    label: 'مشغولة',
    bg: '#EFF6FF',
    color: '#1D4ED8',
    border: '#BFDBFE',
    icon: <SyncOutlined />,
  },
  RESERVED: {
    label: 'محجوزة',
    bg: '#FFFBEB',
    color: '#B45309',
    border: '#FDE68A',
    icon: <ClockCircleOutlined />,
  },

  // Delivery
  READY_FOR_DELIVERY: {
    label: 'جاهز للتوصيل',
    bg: '#F0FDF4',
    color: '#15803D',
    border: '#BBF7D0',
    icon: <CheckCircleOutlined />,
  },
  OUT_FOR_DELIVERY: {
    label: 'في الطريق',
    bg: '#FFF7ED',
    color: '#C2410C',
    border: '#FFEDD5',
    icon: <CarOutlined />,
  },
  DELIVERED: {
    label: 'تم التوصيل',
    bg: '#F8FAFC',
    color: '#475569',
    border: '#E2E8F0',
    icon: <CheckCircleOutlined />,
  },
};

const BadgeContainer = styled.span<{ $bg: string; $color: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
  white-space: nowrap;

  .anticon {
    font-size: 12px;
  }
`;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    bg: '#F1F5F9',
    color: '#475569',
    border: '#CBD5E1',
  };

  return (
    <BadgeContainer
      $bg={config.bg}
      $color={config.color}
      $border={config.border}
      className={className}
    >
      {config.icon}
      <span>{config.label}</span>
    </BadgeContainer>
  );
}
