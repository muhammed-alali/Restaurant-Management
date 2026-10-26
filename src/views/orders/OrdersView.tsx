"use client";

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Button, Segmented, Space, message, Badge, Drawer } from "antd";
import { useMediaQuery } from "react-responsive";
import {
  PlusOutlined,
  ReloadOutlined,
  ShopOutlined,
  ShoppingOutlined,
  CarOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableCard } from "@/components/tables/TableCard";
import { OrderTouchCard } from "@/components/orders/OrderTouchCard";
import { PosBillPanel } from "@/components/orders/PosBillPanel";
import { NewOrderModal } from "@/components/orders/NewOrderModal";
import { ReceiptPrinter } from "@/components/orders/ReceiptPrinter";
import { useOrders } from "@/hooks/useOrders";
import { useMenu } from "@/hooks/useMenu";
import { useTables } from "@/hooks/useTables";
import type { Order, RestaurantTable, OrderType } from "@/types";

type PosSection = "TABLES" | "TAKEAWAY" | "DELIVERY" | "ALL";

const SplitContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const MainGridArea = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  width: 100%;
`;

const SideBillArea = styled.div`
  flex: 2;
  min-width: 320px;
  max-width: 440px;
  width: 100%;

  @media (max-width: 1024px) {
    display: none; /* Handled via Drawer on mobile */
  }
`;

const MobileBillFloatingBar = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 99;
    background: #172a43;
    color: #ffffff;
    border-radius: 12px;
    padding: 12px 18px;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 10px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SegmentedScrollWrapper = styled.div`
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

  @media (max-width: 640px) {
    .ant-segmented-item-label {
      padding: 4px 8px !important;
      font-size: 13px !important;
    }
  }
`;

const SearchInputWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    .ant-input-affix-wrapper {
      width: 100% !important;
    }
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
`;

const EmptyNotice = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

export function OrdersView() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const {
    orders,
    allOrders,
    loading,
    searchQuery,
    setSearchQuery,
    refresh: refreshOrders,
    updateOrderStatus,
    createOrder,
  } = useOrders();

  const { allItems: menuItems } = useMenu();
  const { allTables: tables, refresh: refreshTables } = useTables();

  const [activeSection, setActiveSection] = useState<PosSection>("TABLES");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialTableId, setModalInitialTableId] = useState<
    string | undefined
  >();
  const [modalInitialType, setModalInitialType] =
    useState<OrderType>("DINE_IN");
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [settling, setSettling] = useState(false);

  // Active orders map by table ID
  const tableOrderMap = useMemo(() => {
    const map = new Map<string, Order>();
    allOrders.forEach((o) => {
      if (o.tableId && o.status !== "COMPLETED" && o.status !== "CANCELLED") {
        map.set(o.tableId, o);
      }
    });
    return map;
  }, [allOrders]);

  // Filtered lists
  const takeawayOrders = useMemo(
    () =>
      allOrders.filter(
        (o) =>
          o.type === "TAKEAWAY" &&
          o.status !== "COMPLETED" &&
          o.status !== "CANCELLED" &&
          (searchQuery ? String(o.orderNumber).includes(searchQuery) : true),
      ),
    [allOrders, searchQuery],
  );

  const deliveryOrders = useMemo(
    () =>
      allOrders.filter(
        (o) =>
          o.type === "DELIVERY" &&
          o.status !== "COMPLETED" &&
          o.status !== "CANCELLED" &&
          (searchQuery ? String(o.orderNumber).includes(searchQuery) : true),
      ),
    [allOrders, searchQuery],
  );

  const filteredAllOrders = useMemo(
    () =>
      allOrders.filter((o) =>
        searchQuery ? String(o.orderNumber).includes(searchQuery) : true,
      ),
    [allOrders, searchQuery],
  );

  // Automatically close mobile drawer when window is resized to large screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle clicking on a table card
  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    const existingOrder = tableOrderMap.get(table.id);
    if (existingOrder) {
      setSelectedOrder(existingOrder);
    } else {
      setSelectedOrder(null);
    }
    // Only open drawer on mobile/small screens (<= 1024px)
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  // Handle start new order for a table
  const handleStartOrderForTable = (table: RestaurantTable) => {
    setModalInitialTableId(table.id);
    setModalInitialType("DINE_IN");
    setModalOpen(true);
  };

  // Handle start new takeaway order
  const handleStartNewTakeawayOrder = () => {
    setModalInitialTableId(undefined);
    setModalInitialType("TAKEAWAY");
    setModalOpen(true);
  };

  // Handle start general new order
  const handleStartGeneralNewOrder = () => {
    setModalInitialTableId(undefined);
    setModalInitialType(
      activeSection === "DELIVERY"
        ? "DELIVERY"
        : activeSection === "TAKEAWAY"
          ? "TAKEAWAY"
          : "DINE_IN",
    );
    setModalOpen(true);
  };

  // Handle clicking on an order card
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    if (order.tableId) {
      const t = tables.find((tbl) => tbl.id === order.tableId);
      setSelectedTable(t || null);
    } else {
      setSelectedTable(null);
    }
    // Only open drawer on mobile/small screens (<= 1024px)
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  // Settle order (تسكير الحساب ودفع الفاتورة)
  const handleSettleOrder = async (order: Order) => {
    try {
      setSettling(true);
      const updated = await updateOrderStatus(order.id, "COMPLETED");
      if (updated) {
        message.success(`تم تسكير الحساب بنجاح للطلب #${order.orderNumber}`);
        // Free the table locally and open receipt for printing
        setPrintOrder({ ...order, status: "COMPLETED" });
        setSelectedOrder(null);
        setSelectedTable(null);
        setMobileDrawerOpen(false);
        await Promise.all([refreshOrders(), refreshTables()]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر تسكير الحساب";
      message.error(msg);
    } finally {
      setSettling(false);
    }
  };

  // Keep selectedTable updated with latest table data from tables list
  React.useEffect(() => {
    if (selectedTable) {
      const freshTable = tables.find((t) => t.id === selectedTable.id);
      if (freshTable && freshTable.status !== selectedTable.status) {
        setSelectedTable(freshTable);
      }
    }
  }, [tables, selectedTable]);

  // Keep selectedOrder in sync when active table orders update
  React.useEffect(() => {
    if (selectedTable) {
      const activeOrder = tableOrderMap.get(selectedTable.id);
      if (activeOrder) {
        if (
          !selectedOrder ||
          selectedOrder.id !== activeOrder.id ||
          selectedOrder.status !== activeOrder.status
        ) {
          setSelectedOrder(activeOrder);
        }
      } else {
        if (selectedOrder && selectedOrder.tableId === selectedTable.id) {
          setSelectedOrder(null);
        }
      }
    }
  }, [selectedTable, tableOrderMap, selectedOrder]);

  const handleCreateOrder = async (
    orderData: Parameters<typeof createOrder>[0],
  ) => {
    const res = await createOrder(orderData);
    if (res) {
      setSelectedOrder(res);
      if (res.tableId) {
        const tbl = tables.find((t) => t.id === res.tableId);
        if (tbl) {
          setSelectedTable({ ...tbl, status: "OCCUPIED" });
        }
      }
      await Promise.all([refreshOrders(), refreshTables()]);
      if (isMobile) {
        setMobileDrawerOpen(true);
      }
      return true;
    }
    return false;
  };

  // Cancel order request
  const handleCancelOrder = (orderId: string) => {
    setConfirmCancelId(orderId);
  };

  const handleConfirmCancel = async () => {
    if (!confirmCancelId) return;
    const ok = await updateOrderStatus(confirmCancelId, "CANCELLED");
    if (ok) {
      message.success("تم إلغاء الطلب بنجاح");
      setSelectedOrder(null);
      setSelectedTable(null);
      setMobileDrawerOpen(false);
      await Promise.all([refreshOrders(), refreshTables()]);
    }
    setConfirmCancelId(null);
  };

  const handlePrintReceipt = (order: Order) => {
    setPrintOrder(order);
  };

  return (
    <div>
      <PageHeader
        title="شاشة الطلبات والكاشير"
        subtitle="إدارة طاولات الصالة، طلبات السفري والتوصيل، وتسكير الحسابات وطباعة الفيش بلمسة واحدة"
        actions={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                refreshOrders();
                refreshTables();
              }}
              loading={loading}
            >
              تحديث
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleStartGeneralNewOrder}
              style={{
                backgroundColor: "#F06436",
                borderColor: "#F06436",
                fontWeight: 600,
              }}
            >
              + طلب جديد
            </Button>
          </Space>
        }
      />

      <SplitContainer>
        {/* Right side: Touch categories and cards grid */}
        <MainGridArea>
          <ToolbarRow>
            <SegmentedScrollWrapper>
              <Segmented<PosSection>
                value={activeSection}
                onChange={setActiveSection}
                options={[
                  {
                    label: (
                      <Space size={6}>
                        <ShopOutlined />
                        <span>طاولات الصالة</span>
                        <Badge
                          count={
                            tables.filter((t) => t.status === "OCCUPIED").length
                          }
                          style={{ backgroundColor: "#2563EB" }}
                        />
                      </Space>
                    ),
                    value: "TABLES",
                  },
                  {
                    label: (
                      <Space size={6}>
                        <ShoppingOutlined />
                        <span>سفري</span>
                        <Badge
                          count={takeawayOrders.length}
                          style={{ backgroundColor: "#F06436" }}
                        />
                      </Space>
                    ),
                    value: "TAKEAWAY",
                  },
                  {
                    label: (
                      <Space size={6}>
                        <CarOutlined />
                        <span>توصيل</span>
                        <Badge
                          count={deliveryOrders.length}
                          style={{ backgroundColor: "#16A34A" }}
                        />
                      </Space>
                    ),
                    value: "DELIVERY",
                  },
                  {
                    label: (
                      <Space size={6}>
                        <UnorderedListOutlined />
                        <span>كافة الطلبات</span>
                      </Space>
                    ),
                    value: "ALL",
                  },
                ]}
                size={isMobile ? "middle" : "large"}
              />
            </SegmentedScrollWrapper>

            <SearchInputWrapper>
              <SearchInput
                placeholder="بحث برقم الطلب..."
                value={searchQuery}
                onChange={setSearchQuery}
                width={200}
              />
            </SearchInputWrapper>
          </ToolbarRow>

          {/* Section: Tables */}
          {activeSection === "TABLES" && (
            <CardsGrid>
              {tables.map((table) => {
                const isSelected = selectedTable?.id === table.id;
                return (
                  <TableCard
                    key={table.id}
                    table={table}
                    isSelected={isSelected}
                    onSelect={handleSelectTable}
                    onNewOrder={handleStartOrderForTable}
                  />
                );
              })}
            </CardsGrid>
          )}

          {/* Section: Takeaway */}
          {activeSection === "TAKEAWAY" && (
            <div>
              {takeawayOrders.length === 0 ? (
                <EmptyNotice>
                  لا توجد طلبات سفري نشطة حالياً. يمكنك الضغط على "+ طلب جديد"
                  لتسجيل طلب سفري.
                </EmptyNotice>
              ) : (
                <CardsGrid>
                  {takeawayOrders.map((ord) => (
                    <OrderTouchCard
                      key={ord.id}
                      order={ord}
                      isSelected={selectedOrder?.id === ord.id}
                      onSelect={handleSelectOrder}
                    />
                  ))}
                </CardsGrid>
              )}
            </div>
          )}

          {/* Section: Delivery */}
          {activeSection === "DELIVERY" && (
            <div>
              {deliveryOrders.length === 0 ? (
                <EmptyNotice>لا توجد طلبات توصيل نشطة حالياً.</EmptyNotice>
              ) : (
                <CardsGrid>
                  {deliveryOrders.map((ord) => (
                    <OrderTouchCard
                      key={ord.id}
                      order={ord}
                      isSelected={selectedOrder?.id === ord.id}
                      onSelect={handleSelectOrder}
                    />
                  ))}
                </CardsGrid>
              )}
            </div>
          )}

          {/* Section: All Orders */}
          {activeSection === "ALL" && (
            <div>
              {filteredAllOrders.length === 0 ? (
                <EmptyNotice>لا توجد طلبات مطابقة للبحث.</EmptyNotice>
              ) : (
                <CardsGrid>
                  {filteredAllOrders.map((ord) => (
                    <OrderTouchCard
                      key={ord.id}
                      order={ord}
                      isSelected={selectedOrder?.id === ord.id}
                      onSelect={handleSelectOrder}
                    />
                  ))}
                </CardsGrid>
              )}
            </div>
          )}
        </MainGridArea>

        {/* Left side: POS Bill Panel (Sticky on desktop) */}
        <SideBillArea>
          <PosBillPanel
            order={selectedOrder}
            table={selectedTable}
            onSettleOrder={handleSettleOrder}
            onPrintReceipt={handlePrintReceipt}
            onCancelOrder={handleCancelOrder}
            onStartOrderForTable={handleStartOrderForTable}
            onStartNewTakeawayOrder={handleStartNewTakeawayOrder}
            loading={settling}
          />
        </SideBillArea>
      </SplitContainer>

      {/* Mobile Drawer for Bill & Checkout */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        placement="left"
        width={340}
        destroyOnClose
        title="فاتورة الكاشير"
      >
        <PosBillPanel
          order={selectedOrder}
          table={selectedTable}
          onSettleOrder={handleSettleOrder}
          onPrintReceipt={handlePrintReceipt}
          onCancelOrder={handleCancelOrder}
          onStartOrderForTable={handleStartOrderForTable}
          onStartNewTakeawayOrder={handleStartNewTakeawayOrder}
          loading={settling}
        />
      </Drawer>

      {/* Floating button on mobile to view bill */}
      {selectedOrder && (
        <MobileBillFloatingBar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>
              الطلب المحدد:
            </span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              طلب #{selectedOrder.orderNumber} ({selectedOrder.total.toFixed(2)}{" "}
              TL)
            </span>
          </div>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            style={{ backgroundColor: "#F06436", borderColor: "#F06436" }}
          >
            عرض الفاتورة وتسكير الحساب
          </Button>
        </MobileBillFloatingBar>
      )}

      {/* New Order Modal */}
      <NewOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrder}
        menuItems={menuItems}
        tables={tables}
        initialTableId={modalInitialTableId}
        initialType={modalInitialType}
      />

      {/* Receipt Print (hidden — opens the browser print dialog directly) */}
      <ReceiptPrinter
        order={printOrder}
        open={Boolean(printOrder)}
        onClose={() => setPrintOrder(null)}
      />

      {/* Confirm Cancellation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmCancelId)}
        title="إلغاء الطلب"
        content="هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذه العملية."
        okText="نعم، إلغاء الطلب"
        cancelText="تراجع"
        okDanger
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmCancelId(null)}
      />
    </div>
  );
}
