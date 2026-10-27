'use client';

import React from 'react';
import styled from 'styled-components';
import { KitchenOrderCard } from './KitchenOrderCard';
import type { Order, OrderStatus } from '@/types';

interface KitchenColumnProps {
  title: string;
  count: number;
  orders: Order[];
  color: string;
  badgeBg: string;
  isDragOver: boolean;
  draggedOrderId: string | null;
  onDragOverColumn: () => void;
  onDropOrder: (orderId: string) => void;
  onOrderDragStart: (orderId: string) => void;
  onOrderDragEnd: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const ColumnWrapper = styled.div<{ $isDragOver: boolean }>`
  position: relative;
  flex: 1;
  min-width: 320px;
  background-color: ${({ $isDragOver, theme }) =>
    $isDragOver ? '#EFF6FF' : theme.colors.surfaceWhite};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  outline: ${({ $isDragOver }) => ($isDragOver ? '2px solid #3B82F6' : 'none')};
  outline-offset: -2px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);
  transition: background-color 0.15s ease;

  @media (max-width: 991px) {
    min-width: 0;
    width: 100%;
    max-height: none;
    flex: 1 1 100%;
  }

  @media (min-width: 992px) {
    flex: 1 1 0%;
    min-width: 0;
  }
`;

const ColumnHeader = styled.div<{ $borderBottomColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 2px solid ${({ $borderBottomColor }) => $borderBottomColor};
`;

const ColumnTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CountBadge = styled.span<{ $color: string; $bg: string }>`
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  padding: 2px 10px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 13px;
`;

const CardsScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyColumnText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  color: #94A3B8;
  font-size: 14px;
`;

export function KitchenColumn({
  title,
  count,
  orders,
  color,
  badgeBg,
  isDragOver,
  draggedOrderId,
  onDragOverColumn,
  onDropOrder,
  onOrderDragStart,
  onOrderDragEnd,
  onUpdateStatus,
}: KitchenColumnProps) {
  return (
    <ColumnWrapper
      $isDragOver={isDragOver}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        onDragOverColumn();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const orderId =
          event.dataTransfer.getData('application/x-kitchen-order') ||
          event.dataTransfer.getData('text/plain');
        if (orderId) onDropOrder(orderId);
      }}
    >
      <ColumnHeader $borderBottomColor={color}>
        <ColumnTitle>{title}</ColumnTitle>
        <CountBadge $color={color} $bg={badgeBg}>
          {count}
        </CountBadge>
      </ColumnHeader>

      <CardsScrollContainer>
        {orders.length === 0 ? (
          <EmptyColumnText>
            {isDragOver ? 'أفلت الطلب هنا' : 'لا توجد طلبات في هذه الحالة'}
          </EmptyColumnText>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              isDragging={draggedOrderId === order.id}
              onOrderDragStart={onOrderDragStart}
              onOrderDragEnd={onOrderDragEnd}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </CardsScrollContainer>
    </ColumnWrapper>
  );
}
