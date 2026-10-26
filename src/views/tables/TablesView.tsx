'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Segmented, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { TableCard } from '@/components/tables/TableCard';
import { AddTableModal } from '@/components/tables/AddTableModal';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';
import { useTables } from '@/hooks/useTables';
import { useOrders } from '@/hooks/useOrders';
import { useMenu } from '@/hooks/useMenu';
import type { RestaurantTable, TableStatus, Order } from '@/types';

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
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

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

export function TablesView() {
  const {
    tables,
    allTables,
    loading,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    refresh,
    createTable,
  } = useTables();

  const { allOrders, createOrder, updateOrderStatus } = useOrders();
  const { allItems: menuItems } = useMenu();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<RestaurantTable | null>(null);
  const [activeOrderDrawer, setActiveOrderDrawer] = useState<Order | null>(null);

  const statusOptions = [
    { label: `الكل (${allTables.length})`, value: 'ALL' },
    {
      label: `متاحة (${allTables.filter((t) => t.status === 'AVAILABLE').length})`,
      value: 'AVAILABLE',
    },
    {
      label: `بانتظار الطعام (${allTables.filter((t) => t.status === 'OCCUPIED').length})`,
      value: 'OCCUPIED',
    },
    {
      label: `محجوزة (${allTables.filter((t) => t.status === 'RESERVED').length})`,
      value: 'RESERVED',
    },
  ];

  const handleSelectOccupiedTable = (table: RestaurantTable) => {
    // Find active order on this table
    const order = allOrders.find(
      (o) => o.tableId === table.id && o.status !== 'COMPLETED' && o.status !== 'CANCELLED',
    );
    if (order) {
      setActiveOrderDrawer(order);
    }
  };

  const handleNewOrderForTable = (table: RestaurantTable) => {
    setSelectedTableForOrder(table);
    setNewOrderModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="الطاولات"
        subtitle="إدارة طاولات الصالة، حالة الإشغال، واستقبال طلبات الزبائن"
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              تحديث
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalOpen(true)}
              style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
            >
              إضافة طاولة
            </Button>
          </Space>
        }
      />

      <FilterBar>
        <SegmentedScrollWrapper>
          <Segmented
            options={statusOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as TableStatus | 'ALL')}
            size="middle"
          />
        </SegmentedScrollWrapper>

        <SearchInputWrapper>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="بحث برقم الطاولة..."
            width={240}
          />
        </SearchInputWrapper>
      </FilterBar>

      {loading ? (
        <LoadingState tip="جاري تحميل الطاولات..." />
      ) : tables.length === 0 ? (
        <EmptyState description="لا توجد طاولات مطابقة للبحث" />
      ) : (
        <TablesGrid>
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onSelect={handleSelectOccupiedTable}
              onNewOrder={handleNewOrderForTable}
            />
          ))}
        </TablesGrid>
      )}

      <AddTableModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={async (data) => {
          const res = await createTable(data);
          return Boolean(res);
        }}
      />

      <NewOrderModal
        open={newOrderModalOpen}
        onClose={() => {
          setNewOrderModalOpen(false);
          setSelectedTableForOrder(null);
        }}
        onSubmit={async (data) => {
          const payload = {
            ...data,
            tableId: selectedTableForOrder?.id || data.tableId,
          };
          const res = await createOrder(payload);
          if (res) {
            refresh();
          }
          return Boolean(res);
        }}
        menuItems={menuItems}
        tables={selectedTableForOrder ? [selectedTableForOrder] : allTables}
      />

      <OrderDetailsDrawer
        order={activeOrderDrawer}
        open={Boolean(activeOrderDrawer)}
        onClose={() => setActiveOrderDrawer(null)}
        onUpdateStatus={async (orderId, status) => {
          await updateOrderStatus(orderId, status);
          refresh();
          setActiveOrderDrawer(null);
          return true;
        }}
      />
    </div>
  );
}
