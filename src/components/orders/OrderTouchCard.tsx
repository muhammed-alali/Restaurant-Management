'use client';

import React from 'react';
import styled from 'styled-components';
import { Tag } from 'antd';
import {
  ShopOutlined,
  ShoppingOutlined,
  CarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { Order } from '@/types';
import { ORDER_STATUS_LABELS } from '@/types';

interface OrderTouchCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (order: Order) => void;
}

const CardWrapper = styled.div<{ $selected: boolean; $status: string }>`
  background: #FFFFFF;
  border-radius: 14px;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.colors.primaryOrange : '#E2E8F0')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 6px 20px rgba(240, 100, 54, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.03)'};
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: none;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $selected, theme }) => ($selected ? theme.colors.primaryOrange : '#CBD5E1')};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderNumberBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 16px;
  color: #172033;
`;

const TypeTag = styled.span<{ $type: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: ${({ $type }) =>
    $type === 'DINE_IN' ? '#EFF6FF' : $type === 'DELIVERY' ? '#FEF3C7' : '#F1F5F9'};
  color: ${({ $type }) =>
    $type === 'DINE_IN' ? '#1D4ED8' : $type === 'DELIVERY' ? '#B45309' : '#475569'};
`;

const ItemsSummary = styled.div`
  font-size: 13px;
  color: #64748B;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px dashed #E2E8F0;
`;

const OrderTime = styled.span`
  font-size: 12px;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OrderTotal = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #F06436;
`;

export function OrderTouchCard({ order, isSelected, onSelect }: OrderTouchCardProps) {
  const getOrderIcon = () => {
    if (order.type === 'DINE_IN') return <ShopOutlined />;
    if (order.type === 'DELIVERY') return <CarOutlined />;
    return <ShoppingOutlined />;
  };

  const getTypeName = () => {
    if (order.type === 'DINE_IN') return `طاولة ${order.tableNumber ?? '-'}`;
    if (order.type === 'DELIVERY') return 'توصيل';
    return 'سفري';
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'NEW':
        return 'orange';
      case 'PREPARING':
        return 'processing';
      case 'READY':
        return 'green';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const itemsText = order.items
    .map((item) => `${item.quantity}× ${item.menuItemName}`)
    .join('، ');

  const timeStr = new Date(order.createdAt).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <CardWrapper
      $selected={isSelected}
      $status={order.status}
      onClick={() => onSelect(order)}
    >
      <TopRow>
        <OrderNumberBadge>
          <span>طلب #{order.orderNumber}</span>
          <TypeTag $type={order.type}>
            {getOrderIcon()}
            <span>{getTypeName()}</span>
          </TypeTag>
        </OrderNumberBadge>
        <Tag color={getStatusColor()}>{ORDER_STATUS_LABELS[order.status]}</Tag>
      </TopRow>

      <ItemsSummary title={itemsText}>{itemsText || 'لا توجد أصناف'}</ItemsSummary>

      <BottomRow>
        <OrderTime>
          <ClockCircleOutlined />
          <span>{timeStr}</span>
        </OrderTime>
        <OrderTotal>{order.total.toFixed(2)} TL</OrderTotal>
      </BottomRow>
    </CardWrapper>
  );
}
