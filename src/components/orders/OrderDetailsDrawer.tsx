'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Drawer, Button, Space, Divider, Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ReceiptPrinter } from '@/components/orders/ReceiptPrinter';
import type { Order, OrderStatus } from '@/types';

interface OrderDetailsDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
`;

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const ItemNotes = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const OrderTotalBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #FFF7ED;
  border: 1px solid #FFEDD5;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 20px;
`;

const DrawerFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const PrimaryActionRow = styled.div`
  width: 100%;

  .ant-btn {
    width: 100% !important;
    height: 38px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
  }
`;

const SecondaryActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;

  .ant-btn {
    width: 100% !important;
    height: 34px !important;
    font-weight: 500 !important;
    font-size: 12px !important;
    border-radius: 8px !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export function OrderDetailsDrawer({
  order,
  open,
  onClose,
  onUpdateStatus,
}: OrderDetailsDrawerProps) {
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!order) return null;

  const orderTypeArabic =
    order.type === 'DINE_IN'
      ? 'داخل المطعم'
      : order.type === 'TAKEAWAY'
      ? 'استلام خارجي'
      : 'توصيل';

  const orderTimeFormatted = new Date(order.createdAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>طلب #{order.orderNumber}</span>
          <StatusBadge status={order.status} />
        </div>
      }
      placement="left"
      width={typeof window !== 'undefined' && window.innerWidth < 480 ? '100%' : 460}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px' },
        footer: { padding: '12px 16px' },
      }}
      footer={
        <DrawerFooterContainer>
          {order.status === 'NEW' && (
            <PrimaryActionRow>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
                onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              >
                بدء التحضير
              </Button>
            </PrimaryActionRow>
          )}

          {order.status === 'PREPARING' && (
            <PrimaryActionRow>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(order.id, 'READY')}
              >
                جاهز للتسليم
              </Button>
            </PrimaryActionRow>
          )}

          {order.status === 'READY' && (
            <PrimaryActionRow>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              >
                إتمام الطلب
              </Button>
            </PrimaryActionRow>
          )}

          <SecondaryActionsGrid>
            <Button
              icon={<PrinterOutlined />}
              onClick={() => setReceiptOpen(true)}
              style={{ fontWeight: 600, color: '#F06436', borderColor: '#F06436' }}
            >
              طباعة الفاتورة
            </Button>

            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
              >
                إلغاء الطلب
              </Button>
            )}
          </SecondaryActionsGrid>
        </DrawerFooterContainer>
      }
    >
      <DetailRow>
        <DetailLabel>نوع الطلب:</DetailLabel>
        <DetailValue>{orderTypeArabic}</DetailValue>
      </DetailRow>

      {order.tableNumber && (
        <DetailRow>
          <DetailLabel>رقم الطاولة:</DetailLabel>
          <DetailValue>طاولة {order.tableNumber}</DetailValue>
        </DetailRow>
      )}

      <DetailRow>
        <DetailLabel>وقت استلام الطلب:</DetailLabel>
        <DetailValue>{orderTimeFormatted}</DetailValue>
      </DetailRow>

      {order.notes && (
        <DetailRow>
          <DetailLabel>ملاحظات الطلب:</DetailLabel>
          <DetailValue style={{ color: '#D97706' }}>{order.notes}</DetailValue>
        </DetailRow>
      )}

      <Divider style={{ margin: '16px 0' }}>قائمة الأصناف ({order.items.length})</Divider>

      <ItemsList>
        {order.items.map((item, idx) => (
          <ItemCard key={item.id || idx}>
            <ItemInfo>
              <ItemName>
                {item.menuItemName} × {item.quantity}
              </ItemName>
              {item.notes && <ItemNotes>ملاحظة: {item.notes}</ItemNotes>}
            </ItemInfo>
            <span style={{ fontWeight: 600 }}>{item.unitPrice * item.quantity} TL</span>
          </ItemCard>
        ))}
      </ItemsList>

      <OrderTotalBanner>
        <span>الإجمالي المستحق:</span>
        <span style={{ color: '#F06436', fontSize: 18 }}>{order.total} TL</span>
      </OrderTotalBanner>

      <ReceiptPrinter
        order={order}
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </Drawer>
  );
}
