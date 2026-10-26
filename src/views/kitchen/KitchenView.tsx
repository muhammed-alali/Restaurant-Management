"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Button, Space, Tag, Segmented, Badge } from "antd";
import {
  ReloadOutlined,
  FireOutlined,
  SoundOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@/components/common/PageHeader";
import { KitchenColumn } from "@/components/kitchen/KitchenColumn";
import { useKitchen } from "@/hooks/useKitchen";
import {
  isNotificationSoundEnabled,
  playNewOrderSound,
  setNotificationSoundEnabled,
} from "@/lib/notificationSound";
import type { OrderStatus } from "@/types";

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

  const [activeTab, setActiveTab] = useState<
    "ALL" | "NEW" | "PREPARING" | "READY"
  >("ALL");
  const [soundOn, setSoundOn] = useState(isNotificationSoundEnabled);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<OrderStatus | null>(null);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setNotificationSoundEnabled(next);
    // When turning it on, play the chime as feedback and unlock audio.
    if (next) playNewOrderSound();
  };

  const handleOrderDragStart = (orderId: string) => {
    setDraggedOrderId(orderId);
  };

  const handleOrderDragEnd = () => {
    setDraggedOrderId(null);
    setDragOverStatus(null);
  };

  const handleDropOrder = (orderId: string, status: OrderStatus) => {
    setDraggedOrderId(null);
    setDragOverStatus(null);

    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status === status) return;

    void updateStatus(orderId, status);
  };

  return (
    <div>
      <PageHeader
        title="شاشة المطبخ"
        subtitle="متابعة فورية للطلبات — اسحب الطلب وأفلته بين الأقسام لتحديث حالته"
        badge={
          <Tag color="orange" icon={<FireOutlined />}>
            مباشر (تحديث تلقائي)
          </Tag>
        }
        actions={
          <Space>
            <Button
              icon={soundOn ? <SoundOutlined /> : <AudioMutedOutlined />}
              onClick={toggleSound}
              title="تشغيل / كتم تنبيه الطلبات الجديدة"
            >
              {soundOn ? "تنبيه الصوت: مفعّل" : "تنبيه الصوت: مكتوم"}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={refresh}
              loading={loading}
            >
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
                  <Badge
                    count={orders.length}
                    style={{ backgroundColor: "#475569" }}
                  />
                </Space>
              ),
              value: "ALL",
            },
            {
              label: (
                <Space size={6}>
                  <span>طلبات جديدة</span>
                  <Badge
                    count={newOrders.length}
                    style={{ backgroundColor: "#B45309" }}
                  />
                </Space>
              ),
              value: "NEW",
            },
            {
              label: (
                <Space size={6}>
                  <span>قيد التحضير</span>
                  <Badge
                    count={preparingOrders.length}
                    style={{ backgroundColor: "#1D4ED8" }}
                  />
                </Space>
              ),
              value: "PREPARING",
            },
            {
              label: (
                <Space size={6}>
                  <span>جاهزة للتسليم</span>
                  <Badge
                    count={readyOrders.length}
                    style={{ backgroundColor: "#15803D" }}
                  />
                </Space>
              ),
              value: "READY",
            },
          ]}
        />
      </MobileTabWrapper>

      <BoardContainer $isMobileSingle={activeTab !== "ALL"}>
        {(activeTab === "ALL" || activeTab === "NEW") && (
          <KitchenColumn
            title="طلبات جديدة"
            count={newOrders.length}
            orders={newOrders}
            color="#B45309"
            badgeBg="#FFFBEB"
            isDragOver={dragOverStatus === "NEW"}
            draggedOrderId={draggedOrderId}
            onDragOverColumn={() => setDragOverStatus("NEW")}
            onDropOrder={(orderId) => handleDropOrder(orderId, "NEW")}
            onOrderDragStart={handleOrderDragStart}
            onOrderDragEnd={handleOrderDragEnd}
            onUpdateStatus={updateStatus}
          />
        )}

        {(activeTab === "ALL" || activeTab === "PREPARING") && (
          <KitchenColumn
            title="قيد التحضير"
            count={preparingOrders.length}
            orders={preparingOrders}
            color="#1D4ED8"
            badgeBg="#EFF6FF"
            isDragOver={dragOverStatus === "PREPARING"}
            draggedOrderId={draggedOrderId}
            onDragOverColumn={() => setDragOverStatus("PREPARING")}
            onDropOrder={(orderId) => handleDropOrder(orderId, "PREPARING")}
            onOrderDragStart={handleOrderDragStart}
            onOrderDragEnd={handleOrderDragEnd}
            onUpdateStatus={updateStatus}
          />
        )}

        {(activeTab === "ALL" || activeTab === "READY") && (
          <KitchenColumn
            title="جاهزة للتسليم"
            count={readyOrders.length}
            orders={readyOrders}
            color="#15803D"
            badgeBg="#F0FDF4"
            isDragOver={dragOverStatus === "READY"}
            draggedOrderId={draggedOrderId}
            onDragOverColumn={() => setDragOverStatus("READY")}
            onDropOrder={(orderId) => handleDropOrder(orderId, "READY")}
            onOrderDragStart={handleOrderDragStart}
            onOrderDragEnd={handleOrderDragEnd}
            onUpdateStatus={updateStatus}
          />
        )}
      </BoardContainer>
    </div>
  );
}
