'use client';

import React from 'react';
import styled from 'styled-components';
import { Button, Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CheckOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import type { Order, OrderStatus } from '@/types';

interface KitchenOrderCardProps {
  order: Order;
  isDragging: boolean;
  onOrderDragStart: (orderId: string) => void;
  onOrderDragEnd: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const CardWrapper = styled.div<{ $status: OrderStatus; $isDragging: boolean }>`
  background-color: #FFFFFF;
  border-radius: 12px;
  border: 1px solid
    ${({ $status }) =>
      $status === 'NEW'
        ? '#FDE68A'
        : $status === 'PREPARING'
        ? '#BFDBFE'
        : '#BBF7D0'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: grab;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.45 : 1)};
  transition: opacity 0.15s ease, box-shadow 0.15s ease;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 10px;
`;

const OrderIdGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OrderNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #172033;
`;

const TimeTag = styled.span`
  font-size: 12px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #172033;
`;

const QuantityBadge = styled.span`
  background-color: #F06436;
  color: #FFFFFF;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 700;
  font-size: 13px;
`;

const NotesAlert = styled.div`
  background-color: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #92400E;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const ActionArea = styled.div`
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
`;

export function KitchenOrderCard({
  order,
  isDragging,
  onOrderDragStart,
  onOrderDragEnd,
  onUpdateStatus,
}: KitchenOrderCardProps) {
  const typeLabel =
    order.type === 'DINE_IN'
      ? `طاولة ${order.tableNumber ?? '-'}`
      : order.type === 'TAKEAWAY'
      ? 'سفري'
      : 'توصيل';

  const orderTime = new Date(order.createdAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <CardWrapper
      $status={order.status}
      $isDragging={isDragging}
      draggable
      title="اسحب الطلب وأفلته في القسم المطلوب"
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/x-kitchen-order', order.id);
        event.dataTransfer.setData('text/plain', order.id);
        onOrderDragStart(order.id);
      }}
      onDragEnd={onOrderDragEnd}
    >
      <CardHeader>
        <OrderIdGroup>
          <HolderOutlined style={{ color: '#94A3B8', fontSize: 15 }} />
          <OrderNumber>#{order.orderNumber}</OrderNumber>
          <Tag color={order.type === 'DINE_IN' ? 'blue' : 'orange'}>{typeLabel}</Tag>
        </OrderIdGroup>
        <TimeTag>
          <ClockCircleOutlined />
          <span>{orderTime}</span>
        </TimeTag>
      </CardHeader>

      <ItemsList>
        {order.items.map((item, idx) => (
          <div key={item.id || idx}>
            <ItemRow>
              <ItemName>{item.menuItemName}</ItemName>
              <QuantityBadge>{item.quantity}×</QuantityBadge>
            </ItemRow>
            {item.notes && (
              <span style={{ fontSize: 11, color: '#D97706', display: 'block', marginTop: 2 }}>
                ⚠️ {item.notes}
              </span>
            )}
          </div>
        ))}
      </ItemsList>

      {order.notes && (
        <NotesAlert>
          ملاحظة عامة: {order.notes}
        </NotesAlert>
      )}

      <ActionArea>
        {order.status === 'NEW' && (
          <Button
            type="primary"
            block
            size="large"
            icon={<SyncOutlined />}
            style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', fontWeight: 600 }}
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
          >
            بدء التحضير
          </Button>
        )}

        {order.status === 'PREPARING' && (
          <Button
            type="primary"
            block
            size="large"
            icon={<CheckCircleOutlined />}
            style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', fontWeight: 600 }}
            onClick={() => onUpdateStatus(order.id, 'READY')}
          >
            الطلب جاهز
          </Button>
        )}

        {order.status === 'READY' && (
          <Button
            block
            size="large"
            icon={<CheckOutlined />}
            style={{
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
              color: '#15803D',
              fontWeight: 600,
            }}
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
          >
            تسليم للزبون / إنهاء
          </Button>
        )}
      </ActionArea>
    </CardWrapper>
  );
}
