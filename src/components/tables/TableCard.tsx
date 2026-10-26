'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { UserOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { RestaurantTable } from '@/types';

interface TableCardProps {
  table: RestaurantTable;
  onSelect: (table: RestaurantTable) => void;
  onNewOrder?: (table: RestaurantTable) => void;
  isSelected?: boolean;
}

const CardWrapper = styled.div<{ $status: string; $selected?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surfaceWhite};
  border-radius: 14px;
  border: 2px solid
    ${({ $selected, $status, theme }) =>
      $selected
        ? theme.colors.primaryOrange
        : $status === 'OCCUPIED'
        ? theme.colors.primaryBlue
        : $status === 'AVAILABLE'
        ? '#BBF7D0'
        : theme.colors.border};
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 6px 20px rgba(240, 100, 54, 0.15)'
      : '0 2px 6px rgba(0, 0, 0, 0.02)'};
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.primaryOrange : '#94A3B8'};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TableCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
`;

const IllustrationWrapper = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-top: 8px;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const CapacityTag = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

export function TableCard({ table, onSelect, onNewOrder, isSelected = false }: TableCardProps) {
  return (
    <CardWrapper
      $status={table.status}
      $selected={isSelected}
      onClick={() => onSelect(table)}
    >
      <CardTop>
        <TableNumber>طاولة {table.number}</TableNumber>
        <StatusBadge status={table.status} />
      </CardTop>

      <TableCenter>
        <IllustrationWrapper>
          <Image
            src="/images/tables/table.svg"
            alt={`طاولة ${table.number}`}
            width={80}
            height={80}
          />
        </IllustrationWrapper>
      </TableCenter>

      <CardMeta>
        <CapacityTag>
          <UserOutlined />
          <span>{table.capacity} مقاعد</span>
        </CapacityTag>

        {table.status === 'AVAILABLE' && onNewOrder && (
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onNewOrder(table);
            }}
            style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
          >
            طلب جديد
          </Button>
        )}

        {table.status === 'OCCUPIED' && (
          <Button
            size="small"
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(table);
            }}
          >
            الفاتورة
          </Button>
        )}

        {table.status === 'RESERVED' && (
          <span style={{ fontSize: 12, color: '#F59E0B' }}>محجوزة مسبقاً</span>
        )}
      </CardMeta>
    </CardWrapper>
  );
}
