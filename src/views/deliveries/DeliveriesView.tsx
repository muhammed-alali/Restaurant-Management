'use client';
import { useMediaQuery } from 'react-responsive';
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Space, message, Drawer, Segmented } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  CarOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { BikeCard } from '@/components/deliveries/BikeCard';
import { DeliveryDetailPanel } from '@/components/deliveries/DeliveryDetailPanel';
import { DeliveriesTable } from '@/components/deliveries/DeliveriesTable';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { ReceiptModal } from '@/components/orders/ReceiptModal';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useOrders } from '@/hooks/useOrders';
import { useMenu } from '@/hooks/useMenu';
import { useTables } from '@/hooks/useTables';
import type { Delivery, DeliveryStatus, Order } from '@/types';

const TOTAL_BIKES = 8;

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

const SidePanelArea = styled.div`
  flex: 2;
  min-width: 320px;
  max-width: 440px;
  width: 100%;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #FFFFFF;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;

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

const BikesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

export function DeliveriesView() {
  const {
    deliveries,
    allDeliveries,
    loading,
    searchQuery,
    setSearchQuery,
    refresh,
    updateDeliveryStatus,
  } = useDeliveries();

  const { createOrder, orders } = useOrders();
  const { allItems: menuItems } = useMenu();
  const { allTables: tables } = useTables();

  const [viewMode, setViewMode] = useState<'BIKES' | 'LIST'>('BIKES');
  const [selectedBikeNumber, setSelectedBikeNumber] = useState<number | undefined>(1);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBikeNumber, setModalBikeNumber] = useState<number>(1);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  // Map bike number to active delivery
  const bikeDeliveryMap = useMemo(() => {
    const map = new Map<number, Delivery>();
    allDeliveries.forEach((d) => {
      if (d.status !== 'DELIVERED' && d.status !== 'CANCELLED') {
        const bNum = d.bikeNumber || 1;
        if (!map.has(bNum)) {
          map.set(bNum, d);
        }
      }
    });
    return map;
  }, [allDeliveries]);

  // Handle clicking on a bike card
  const handleSelectBike = (bikeNum: number, delivery?: Delivery) => {
    setSelectedBikeNumber(bikeNum);
    setSelectedDelivery(delivery || null);
    if (isMobile) { setMobileDrawerOpen(true); }
  };

  // Start new delivery order for bike
  const handleNewOrderForBike = (bikeNum: number) => {
    setModalBikeNumber(bikeNum);
    setModalOpen(true);
  };

  // Update status action
  const handleUpdateStatus = async (del: Delivery, newStatus: DeliveryStatus) => {
    const success = await updateDeliveryStatus(del.id, newStatus);
    if (success) {
      message.success(`تم تحديث حالة التوصيل إلى "${newStatus}" بنجاح`);
      if (selectedDelivery && selectedDelivery.id === del.id) {
        setSelectedDelivery({ ...selectedDelivery, status: newStatus });
      }
      refresh();
    }
  };

  // Print receipt
  const handlePrintReceipt = (del: Delivery) => {
    const matchedOrder = orders.find((o) => o.id === del.orderId);
    if (matchedOrder) {
      setPrintOrder(matchedOrder);
    } else {
      // Create minimal mock order for receipt printing
      setPrintOrder({
        id: del.orderId,
        orderNumber: del.orderNumber,
        type: 'DELIVERY',
        status: del.status as any,
        total: del.orderTotal,
        items: del.orderItems.map((i, idx) => ({
          id: `item-${idx}`,
          orderId: del.orderId,
          menuItemId: `m-${idx}`,
          menuItemName: i.name,
          unitPrice: del.orderTotal / (i.quantity || 1),
          quantity: i.quantity,
        })),
        createdAt: del.createdAt,
        updatedAt: del.updatedAt,
      });
    }
  };

  const bikeList = Array.from({ length: TOTAL_BIKES }, (_, i) => i + 1);

  return (
    <div>
      <PageHeader
        title="شاشة إدارة التوصيل (الدليفري)"
        subtitle="متابعة دبابات وموتورات التوصيل، تعيين الطلبات، ومتابعة خروج وتسليم الوجبات"
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refresh} loading={loading}>
              تحديث
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleNewOrderForBike(selectedBikeNumber || 1)}
              style={{ backgroundColor: '#F06436', borderColor: '#F06436', fontWeight: 600 }}
            >
              + طلب دليفري جديد
            </Button>
          </Space>
        }
      />

      <SplitContainer>
        {/* Main Grid: Bike cards */}
        <MainGridArea>
          <ToolbarRow>
            <SegmentedScrollWrapper>
              <Segmented
                value={viewMode}
                onChange={(val) => setViewMode(val as 'BIKES' | 'LIST')}
                options={[
                  {
                    label: (
                      <Space size={6}>
                        <CarOutlined />
                        <span>شبكة الموتورات ({TOTAL_BIKES} دراجات)</span>
                      </Space>
                    ),
                    value: 'BIKES',
                  },
                  {
                    label: (
                      <Space size={6}>
                        <UnorderedListOutlined />
                        <span>سجل الطلبات ({allDeliveries.length})</span>
                      </Space>
                    ),
                    value: 'LIST',
                  },
                ]}
                size={isMobile ? 'middle' : 'large'}
              />
            </SegmentedScrollWrapper>

            <SearchInputWrapper>
              <SearchInput
                placeholder="بحث برقم الطلب أو العميل..."
                value={searchQuery}
                onChange={setSearchQuery}
                width={220}
              />
            </SearchInputWrapper>
          </ToolbarRow>

          {viewMode === 'BIKES' ? (
            <BikesGrid>
              {bikeList.map((bikeNum) => {
                const activeDelivery = bikeDeliveryMap.get(bikeNum);
                const isSelected = selectedBikeNumber === bikeNum;
                return (
                  <BikeCard
                    key={bikeNum}
                    bikeNumber={bikeNum}
                    activeDelivery={activeDelivery}
                    isSelected={isSelected}
                    onSelect={handleSelectBike}
                    onNewOrder={handleNewOrderForBike}
                  />
                );
              })}
            </BikesGrid>
          ) : (
            <DeliveriesTable
              deliveries={deliveries}
              loading={loading}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </MainGridArea>

        {/* Side Panel: Delivery Details */}
        <SidePanelArea>
          <DeliveryDetailPanel
            delivery={selectedDelivery}
            selectedBikeNumber={selectedBikeNumber}
            onUpdateStatus={handleUpdateStatus}
            onPrintReceipt={handlePrintReceipt}
            onStartNewOrderForBike={handleNewOrderForBike}
            loading={loading}
          />
        </SidePanelArea>
      </SplitContainer>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        placement="left"
        width={340}
        destroyOnClose
        title="تفاصيل الموتور والتوصيل"
      >
        <DeliveryDetailPanel
          delivery={selectedDelivery}
          selectedBikeNumber={selectedBikeNumber}
          onUpdateStatus={handleUpdateStatus}
          onPrintReceipt={handlePrintReceipt}
          onStartNewOrderForBike={handleNewOrderForBike}
          loading={loading}
        />
      </Drawer>

      {/* New Order Modal for Delivery */}
      <NewOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createOrder}
        menuItems={menuItems}
        tables={tables}
        initialType="DELIVERY"
      />

      {/* Receipt Modal */}
      <ReceiptModal
        order={printOrder}
        open={Boolean(printOrder)}
        onClose={() => setPrintOrder(null)}
      />
    </div>
  );
}
