'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Space, Tag, Segmented, Badge } from 'antd';
import { ReloadOutlined, FireOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { KitchenColumn } from '@/components/kitchen/KitchenColumn';
import { useKitchen } from '@/hooks/useKitchen';

const MobileTabWrapper = styled.div`
  display: none;
  margin-bottom: 16px;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 2px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .ant-segmented {
    white-space: nowrap;
  }

  @media (max-width: 900px) {
    display: block;
  }
`;

const BoardContainer = styled.div<{ $isMobileSingle?: boolean }>`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 12px;

  @media (max-width: 900px) {
    ${({ $isMobileSingle }) =>
      $isMobileSingle
        ? `
      flex-direction: column;
      overflow-x: visible;
      gap: 16px;
    `
        : `
      overflow-x: auto;
    `}
  }
`;

export function KitchenView() {
  const {
    orders,
    newOrders,
    preparingOrders,
    readyOrders,
    loading,
    refresh,
    updateStatus,
  } = useKitchen();

  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'PREPARING' | 'READY'>('ALL');

  return (
    <div>
      <PageHeader
        title="شاشة المطبخ (KDS)"
        subtitle="متابعة فورية للطلبات الواردة، مراحل الطهي، وإشعار الصالة عند الجاهزية"
        badge={
          <Tag color="orange" icon={<FireOutlined />}>
            مباشر (تحديث تلقائي)
          </Tag>
        }
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refresh} loading={loading}>
              تحديث
            </Button>
          </Space>
        }
      />

      <MobileTabWrapper>
        <Segmented
          value={activeTab}
          onChange={(val) => setActiveTab(val as typeof activeTab)}
          size="middle"
          options={[
            {
              label: (
                <Space size={6}>
                  <span>الكل</span>
                  <Badge count={orders.length} style={{ backgroundColor: '#475569' }} />
                </Space>
              ),
              value: 'ALL',
            },
            {
              label: (
                <Space size={6}>
                  <span>طلبات جديدة</span>
                  <Badge count={newOrders.length} style={{ backgroundColor: '#B45309' }} />
                </Space>
              ),
              value: 'NEW',
            },
            {
              label: (
                <Space size={6}>
                  <span>قيد التحضير</span>
                  <Badge count={preparingOrders.length} style={{ backgroundColor: '#1D4ED8' }} />
                </Space>
              ),
              value: 'PREPARING',
            },
            {
              label: (
                <Space size={6}>
                  <span>جاهزة للتسليم</span>
                  <Badge count={readyOrders.length} style={{ backgroundColor: '#15803D' }} />
                </Space>
              ),
              value: 'READY',
            },
          ]}
        />
      </MobileTabWrapper>

      <BoardContainer $isMobileSingle={activeTab !== 'ALL'}>
        {(activeTab === 'ALL' || activeTab === 'NEW') && (
          <KitchenColumn
            title="طلبات جديدة"
            count={newOrders.length}
            orders={newOrders}
            color="#B45309"
            badgeBg="#FFFBEB"
            onUpdateStatus={updateStatus}
          />
        )}

        {(activeTab === 'ALL' || activeTab === 'PREPARING') && (
          <KitchenColumn
            title="قيد التحضير"
            count={preparingOrders.length}
            orders={preparingOrders}
            color="#1D4ED8"
            badgeBg="#EFF6FF"
            onUpdateStatus={updateStatus}
          />
        )}

        {(activeTab === 'ALL' || activeTab === 'READY') && (
          <KitchenColumn
            title="جاهزة للتسليم"
            count={readyOrders.length}
            orders={readyOrders}
            color="#15803D"
            badgeBg="#F0FDF4"
            onUpdateStatus={updateStatus}
          />
        )}
      </BoardContainer>
    </div>
  );
}
