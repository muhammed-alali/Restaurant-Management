'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Tag, Button } from 'antd';
import {
  CarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { Delivery, DeliveryStatus } from '@/types';
import { DELIVERY_STATUS_LABELS } from '@/types';

interface BikeCardProps {
  bikeNumber: number;
  activeDelivery?: Delivery | null;
  isSelected?: boolean;
  onSelect: (bikeNumber: number, delivery?: Delivery) => void;
  onNewOrder: (bikeNumber: number) => void;
}

const CardWrapper = styled.div<{ $hasOrder: boolean; $selected?: boolean; $status?: string }>`
  background-color: #FFFFFF;
  border-radius: 14px;
  border: 2px solid
    ${({ $selected, $hasOrder, $status, theme }) =>
    $selected
      ? theme.colors.primaryOrange
      : $status === 'OUT_FOR_DELIVERY'
        ? '#F59E0B'
        : $status === 'READY_FOR_DELIVERY'
          ? '#16A34A'
          : $status === 'PREPARING'
            ? '#2563EB'
            : $hasOrder
              ? '#93C5FD'
              : '#E2E8F0'};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 6px 20px rgba(240, 100, 54, 0.15)'
      : '0 2px 6px rgba(0, 0, 0, 0.02)'};
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

const BikeTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #172033;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BikeImageCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  position: relative;
`;

const IllustrationWrapper = styled.div`
  width: 90px;
  height: 70px;
  position: relative;
`;

const OrderSummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #64748B;
  background: #F8FAFC;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px dashed #E2E8F0;
`;

const RecipientName = styled.span`
  font-weight: 700;
  color: #172033;
  font-size: 13px;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
`;

export function BikeCard({
  bikeNumber,
  activeDelivery,
  isSelected = false,
  onSelect,
  onNewOrder,
}: BikeCardProps) {
  const hasOrder = Boolean(activeDelivery && activeDelivery.status !== 'DELIVERED' && activeDelivery.status !== 'CANCELLED');

  const getStatusTag = () => {
    if (!hasOrder) {
      return <Tag color="success">متاح للطلب</Tag>;
    }
    const status = activeDelivery!.status;
    switch (status) {
      case 'NEW':
        return <Tag color="orange">طلب جديد</Tag>;
      case 'PREPARING':
        return <Tag color="processing">قيد التحضير بالمطبخ</Tag>;
      case 'READY_FOR_DELIVERY':
        return <Tag color="green">جاهز للتوصيل</Tag>;
      case 'OUT_FOR_DELIVERY':
        return <Tag color="gold">في الطريق</Tag>;
      default:
        return <Tag color="default">{DELIVERY_STATUS_LABELS[status]}</Tag>;
    }
  };

  return (
    <CardWrapper
      $hasOrder={hasOrder}
      $selected={isSelected}
      $status={activeDelivery?.status}
      onClick={() => onSelect(bikeNumber, activeDelivery || undefined)}
    >
      <CardTop>
        <BikeTitle>
          <CarOutlined style={{ color: '#F06436' }} />
          <span>موتور {bikeNumber}</span>
        </BikeTitle>
        {getStatusTag()}
      </CardTop>

      <BikeImageCenter>
        <IllustrationWrapper>
          <Image
            src="/images/delivery/motorcycle.svg"
            alt={`موتور ${bikeNumber}`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="90px"
          />
        </IllustrationWrapper>
      </BikeImageCenter>

      {hasOrder && activeDelivery ? (
        <OrderSummarySection>
          <RecipientName>العميل: {activeDelivery.recipientName}</RecipientName>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <PhoneOutlined /> {activeDelivery.phone}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <EnvironmentOutlined /> {activeDelivery.address}
          </span>
        </OrderSummarySection>
      ) : (
        <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12, padding: '4px 0' }}>
          الدراجة جاهزة لتوصيل أي طلب
        </div>
      )}

      <CardBottom>
        {hasOrder && activeDelivery ? (
          <>
            <span style={{ fontWeight: 800, color: '#F06436', fontSize: 15 }}>
              {activeDelivery.orderTotal.toFixed(2)} ر.س
            </span>
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(bikeNumber, activeDelivery);
              }}
            >
              عرض التفاصيل
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            size="small"
            icon={<PlusCircleOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onNewOrder(bikeNumber);
            }}
            style={{ backgroundColor: '#F06436', borderColor: '#F06436', width: '100%' }}
          >
            + تسجيل طلب للموتور
          </Button>
        )}
      </CardBottom>
    </CardWrapper>
  );
}
