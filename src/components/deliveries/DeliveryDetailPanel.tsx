"use client";

import React from "react";
import styled from "styled-components";
import { Button, Tag, Space, Popconfirm } from "antd";
import {
  CarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  SendOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { Delivery, DeliveryStatus } from "@/types";
import { DELIVERY_STATUS_LABELS } from "@/types";

interface DeliveryDetailPanelProps {
  delivery: Delivery | null;
  selectedBikeNumber?: number;
  onUpdateStatus: (delivery: Delivery, newStatus: DeliveryStatus) => void;
  onPrintReceipt: (delivery: Delivery) => void;
  onStartNewOrderForBike?: (bikeNumber: number) => void;
  loading?: boolean;
}

const PanelWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  min-height: 520px;
  position: sticky;
  top: 90px;
  overflow: hidden;

  @media (max-width: 1024px) {
    position: static;
    height: auto;
    min-height: auto;
  }
`;

const PanelHeader = styled.div`
  padding: 18px 20px;
  background-color: #172a43;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderMainText = styled.h2`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecipientCard = styled.div`
  padding: 14px 18px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #1e3a8a;
`;

const ItemsScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
`;

const TotalFooter = styled.div`
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
  color: #172033;

  .amount {
    color: #f06436;
    font-size: 22px;
  }
`;

const ActionsContainer = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
`;

const EmptyPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
  gap: 16px;

  .icon {
    font-size: 48px;
    color: #cbd5e1;
  }

  h3 {
    font-size: 16px;
    color: #172033;
    margin: 0;
  }

  p {
    font-size: 13px;
    max-width: 260px;
    margin: 0;
    line-height: 1.5;
  }
`;

export function DeliveryDetailPanel({
  delivery,
  selectedBikeNumber,
  onUpdateStatus,
  onPrintReceipt,
  onStartNewOrderForBike,
  loading = false,
}: DeliveryDetailPanelProps) {
  if (!delivery && selectedBikeNumber) {
    return (
      <PanelWrapper>
        <PanelHeader>
          <HeaderMainText>
            <CarOutlined /> موتور رقم {selectedBikeNumber}
          </HeaderMainText>
          <Tag color="success">متاح</Tag>
        </PanelHeader>
        <EmptyPlaceholder>
          <div className="icon">
            <CarOutlined />
          </div>
          <h3>الدراجة متاحة وجاهزة للطلب</h3>
          <p>
            اضغط أدناه لإنشاء طلب توصيل جديد وتعيينه لموتور {selectedBikeNumber}
            .
          </p>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => onStartNewOrderForBike?.(selectedBikeNumber)}
            style={{
              width: "100%",
              height: "48px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            + تسجيل طلب لموتور {selectedBikeNumber}
          </Button>
        </EmptyPlaceholder>
      </PanelWrapper>
    );
  }

  if (!delivery) {
    return (
      <PanelWrapper>
        <PanelHeader>
          <HeaderMainText>تفاصيل التوصيل (الدليفري)</HeaderMainText>
        </PanelHeader>
        <EmptyPlaceholder>
          <div className="icon">
            <CarOutlined />
          </div>
          <h3>اختر موتورا لعرض تفاصيل الطلب</h3>
          <p>
            اضغط على أي موتور من الشبكة لمتابعة حالة الطلب وتحديثها وطباعة
            الفيش.
          </p>
        </EmptyPlaceholder>
      </PanelWrapper>
    );
  }

  const isCompleted = delivery.status === "DELIVERED";
  const isCancelled = delivery.status === "CANCELLED";

  return (
    <PanelWrapper>
      <PanelHeader>
        <HeaderMainText>
          <CarOutlined /> موتور {delivery.bikeNumber || selectedBikeNumber || 1}{" "}
          — طلب #{delivery.orderNumber}
        </HeaderMainText>
        <Tag color="orange">{DELIVERY_STATUS_LABELS[delivery.status]}</Tag>
      </PanelHeader>

      <RecipientCard>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          العميل: {delivery.recipientName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PhoneOutlined /> الهاتف: {delivery.phone}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <EnvironmentOutlined /> العنوان: {delivery.address}
        </div>
      </RecipientCard>

      <ItemsScrollArea>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748B",
            marginBottom: 4,
          }}
        >
          الأصناف المطلوبة للتوصيل:
        </div>
        {delivery.orderItems.map((item, idx) => (
          <ItemRow key={idx}>
            <span style={{ fontWeight: 600, color: "#172033" }}>
              {item.name}
            </span>
            <span style={{ fontWeight: 700, color: "#F06436" }}>
              × {item.quantity}
            </span>
          </ItemRow>
        ))}
      </ItemsScrollArea>

      <TotalFooter>
        <span>المجموع المطلوب:</span>
        <span className="amount">{delivery.orderTotal.toFixed(2)} TL</span>
      </TotalFooter>

      <ActionsContainer>
        {delivery.status === "NEW" && (
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={loading}
            onClick={() => onUpdateStatus(delivery, "PREPARING")}
            style={{ height: "48px", fontSize: "15px", fontWeight: 700 }}
          >
            بدء التجهيز في المطبخ 👨‍🍳
          </Button>
        )}

        {delivery.status === "PREPARING" && (
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={() => onUpdateStatus(delivery, "READY_FOR_DELIVERY")}
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: 700,
              backgroundColor: "#16A34A",
              borderColor: "#16A34A",
            }}
          >
            تم التجهيز بالمطبخ وجاهز للتوصيل 🛵
          </Button>
        )}

        {delivery.status === "READY_FOR_DELIVERY" && (
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={loading}
            onClick={() => onUpdateStatus(delivery, "OUT_FOR_DELIVERY")}
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: 700,
              backgroundColor: "#F59E0B",
              borderColor: "#F59E0B",
            }}
          >
            انطلاق الموتور (خرج للتوصيل) 🛵💨
          </Button>
        )}

        {delivery.status === "OUT_FOR_DELIVERY" && (
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={() => onUpdateStatus(delivery, "DELIVERED")}
            style={{
              height: "52px",
              fontSize: "16px",
              fontWeight: 700,
              backgroundColor: "#16A34A",
              borderColor: "#16A34A",
            }}
          >
            تم التسليم واستلام المبلغ 🟢
          </Button>
        )}

        <Button
          size="large"
          icon={<PrinterOutlined />}
          onClick={() => onPrintReceipt(delivery)}
          style={{ height: "44px", fontWeight: 600 }}
        >
          طباعة فيش التوصيل (الإيصال) 🧾
        </Button>

        {!isCompleted && !isCancelled && (
          <Popconfirm
            title="هل أنت متأكد من إلغاء طلب التوصيل؟"
            okText="نعم، إلغاء"
            cancelText="تراجع"
            okButtonProps={{ danger: true }}
            onConfirm={() => onUpdateStatus(delivery, "CANCELLED")}
          >
            <Button danger type="text" icon={<CloseCircleOutlined />}>
              إلغاء الطلب
            </Button>
          </Popconfirm>
        )}
      </ActionsContainer>
    </PanelWrapper>
  );
}
