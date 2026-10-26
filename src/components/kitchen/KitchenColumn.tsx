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
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const ColumnWrapper = styled.div`
  flex: 1;
  min-width: 320px;
  background-color: ${({ theme }) => theme.colors.surfaceWhite};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);

  @media (max-width: 900px) {
    min-width: 0;
    width: 100%;
    max-height: none;
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
  onUpdateStatus,
}: KitchenColumnProps) {
  return (
    <ColumnWrapper>
      <ColumnHeader $borderBottomColor={color}>
        <ColumnTitle>{title}</ColumnTitle>
        <CountBadge $color={color} $bg={badgeBg}>
          {count}
        </CountBadge>
      </ColumnHeader>

      <CardsScrollContainer>
        {orders.length === 0 ? (
          <EmptyColumnText>لا توجد طلبات في هذه الحالة</EmptyColumnText>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </CardsScrollContainer>
    </ColumnWrapper>
  );
}
