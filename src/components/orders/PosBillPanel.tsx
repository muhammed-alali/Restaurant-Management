"use client";

import React from "react";
import styled from "styled-components";
import { Button, Tag, Space, Divider } from "antd";
import {
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  CarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { Order, RestaurantTable } from "@/types";
import { ORDER_STATUS_LABELS } from "@/types";

interface PosBillPanelProps {
  order: Order | null;
  table?: RestaurantTable | null;
  onSettleOrder: (order: Order) => void;
  onPrintReceipt: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onStartOrderForTable?: (table: RestaurantTable) => void;
  onStartNewTakeawayOrder?: () => void;
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

const OrderIdTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const HeaderSubText = styled.span`
  color: #94a3b8;
  font-size: 12px;
`;

const ItemsScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyBillPlaceholder = styled.div`
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

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 14px;
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemTitle = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: #172033;
`;

const ItemNotes = styled.span`
  font-size: 11px;
  color: #ea580c;
  background: #fff7ed;
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 2px;
`;

const ItemPriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const QuantityBadge = styled.span`
  background: #e2e8f0;
  color: #334155;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const ItemSubtotal = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: #f06436;
`;

const FinancialSummary = styled.div`
  padding: 16px 20px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #64748b;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 800;
  color: #172033;
  padding-top: 6px;
  border-top: 1px dashed #cbd5e1;

  .amount {
    color: #f06436;
    font-size: 22px;
  }
`;

const ActionButtonsContainer = styled.div`
  padding: 16px 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export function PosBillPanel({
  order,
  table,
  onSettleOrder,
  onPrintReceipt,
  onCancelOrder,
  onStartOrderForTable,
  onStartNewTakeawayOrder,
  loading = false,
}: PosBillPanelProps) {
  // If no order selected but an available table is clicked
  if (!order && table && onStartOrderForTable) {
    const isAvailable = table.status === "AVAILABLE";
    return (
      <PanelWrapper>
        <PanelHeader>
          <HeaderMainText>
            <ShopOutlined /> طاولة رقم {table.number}
          </HeaderMainText>
          <Tag color={isAvailable ? "success" : "warning"}>
            {isAvailable ? "متاحة" : "بانتظار الطعام"}
          </Tag>
        </PanelHeader>
        <EmptyBillPlaceholder>
          <div className="icon">
            <ShopOutlined />
          </div>
          <h3>
            {isAvailable
              ? "طاولة فارغة وجاهزة لاستقبال الزبائن"
              : "لا يوجد طلب نشط لهذه الطاولة"}
          </h3>
          <p>
            اضغط على الزر أدناه لبدء تسجيل طلب الزبون وإرساله للمطبخ مباشرة.
          </p>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => onStartOrderForTable?.(table)}
            style={{
              height: "48px",
              fontSize: "15px",
              fontWeight: 600,
              width: "100%",
            }}
          >
            بدء طلب للطاولة {table.number}
          </Button>
        </EmptyBillPlaceholder>
      </PanelWrapper>
    );
  }

  // If completely empty
  if (!order) {
    return (
      <PanelWrapper>
        <PanelHeader>
          <HeaderMainText>فاتورة الكاشير</HeaderMainText>
        </PanelHeader>
        <EmptyBillPlaceholder>
          <div className="icon">
            <ShoppingOutlined />
          </div>
          <h3>لا يوجد طلب محدد حالياً</h3>
          <p>
            المس أي طاولة بانتظار الطعام أو طلب من القائمة على اليمين لعرض الفاتورة
            وتسكير الحساب وطباعة الإيصال فوراً.
          </p>
          {onStartNewTakeawayOrder && (
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
              onClick={onStartNewTakeawayOrder}
              style={{ height: "48px", fontSize: "15px", fontWeight: 600 }}
            >
              + إنشاء طلب سفري جديد
            </Button>
          )}
        </EmptyBillPlaceholder>
      </PanelWrapper>
    );
  }

  const isCompleted = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const getOrderTypeIcon = () => {
    if (order.type === "DINE_IN") return <ShopOutlined />;
    if (order.type === "DELIVERY") return <CarOutlined />;
    return <ShoppingOutlined />;
  };

  const getOrderTypeName = () => {
    if (order.type === "DINE_IN")
      return `صالة — طاولة ${order.tableNumber ?? ""}`;
    if (order.type === "DELIVERY") return "توصيل — دليفري";
    return "طلب سفري — خارجي";
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "NEW":
        return "orange";
      case "PREPARING":
        return "processing";
      case "READY":
        return "green";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <PanelWrapper>
      <PanelHeader>
        <OrderIdTitle>
          <HeaderMainText>
            {getOrderTypeIcon()} طلب #{order.orderNumber}
          </HeaderMainText>
          <HeaderSubText>{getOrderTypeName()}</HeaderSubText>
        </OrderIdTitle>
        <Tag color={getStatusColor()}>{ORDER_STATUS_LABELS[order.status]}</Tag>
      </PanelHeader>

      <ItemsScrollArea>
        {order.items.map((item) => (
          <ItemCard key={item.id}>
            <ItemInfo>
              <ItemTitle>{item.menuItemName}</ItemTitle>
              {item.notes && <ItemNotes>ملاحظة: {item.notes}</ItemNotes>}
            </ItemInfo>
            <ItemPriceBlock>
              <QuantityBadge>× {item.quantity}</QuantityBadge>
              <ItemSubtotal>
                {(item.unitPrice * item.quantity).toFixed(2)} TL
              </ItemSubtotal>
            </ItemPriceBlock>
          </ItemCard>
        ))}

        {order.notes && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#FEF3C7",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#92400E",
            }}
          >
            <strong>ملاحظات عامة:</strong> {order.notes}
          </div>
        )}
      </ItemsScrollArea>

      <FinancialSummary>
        <SummaryRow>
          <span>عدد الأصناف</span>
          <span>{itemsCount} وجبات</span>
        </SummaryRow>
        <TotalRow>
          <span>المجموع الكلي:</span>
          <span className="amount">{order.total.toFixed(2)} TL</span>
        </TotalRow>
      </FinancialSummary>

      <ActionButtonsContainer>
        {!isCompleted && !isCancelled && (
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={() => onSettleOrder(order)}
            style={{
              height: "52px",
              fontSize: "16px",
              fontWeight: 700,
              backgroundColor: "#16A34A",
              borderColor: "#16A34A",
            }}
          >
            تسكير الحساب / دفع الفاتورة 🟢
          </Button>
        )}

        <Button
          size="large"
          icon={<PrinterOutlined />}
          onClick={() => onPrintReceipt(order)}
          style={{ height: "44px", fontWeight: 600, fontSize: "14px" }}
        >
          طباعة الفيش (إيصال الزبون) 🧾
        </Button>

        {!isCompleted && !isCancelled && (
          <Button
            danger
            type="text"
            icon={<CloseCircleOutlined />}
            style={{ fontSize: "13px" }}
            onClick={() => onCancelOrder(order.id)}
          >
            إلغاء هذا الطلب
          </Button>
        )}
      </ActionButtonsContainer>
    </PanelWrapper>
  );
}
