'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Space, message, Badge } from 'antd';
import { PlusOutlined, ReloadOutlined, FolderAddOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { MenuCard } from '@/components/menu/MenuCard';
import { MenuItemModal } from '@/components/menu/MenuItemModal';
import { AddCategoryModal } from '@/components/menu/AddCategoryModal';
import { useMenu } from '@/hooks/useMenu';
import type { MenuItem } from '@/types';

const CategoriesBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding: 14px 16px;
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  margin-bottom: 20px;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const CategoryCardBtn = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  user-select: none;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryOrange : '#F1F5F9'};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#334155')};

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primaryOrange : '#E2E8F0'};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FilterAndSearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

export function MenuView() {
  const {
    items,
    allItems,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refresh,
    createItem,
    updateItem,
    createCategory,
    toggleAvailability,
  } = useMenu();

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleCreateCategory = async (name: string) => {
    const res = await createCategory(name);
    return Boolean(res);
  };

  return (
    <div>
      <PageHeader
        title="قائمة الطعام (المنيو الإلكتروني)"
        subtitle="تصفح وإدارة الأصناف، الفئات، الأسعار، وتوفر الوجبات بكروت شاشات اللمس"
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              تحديث
            </Button>
            <Button
              icon={<FolderAddOutlined />}
              onClick={() => setCategoryModalOpen(true)}
            >
              + فئة جديدة
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{ backgroundColor: '#F06436', borderColor: '#F06436', fontWeight: 600 }}
            >
              + إضافة أكلة
            </Button>
          </Space>
        }
      />

      {/* Horizontal Electronic Menu Categories Bar */}
      <CategoriesBar>
        <CategoryCardBtn
          $active={selectedCategory === 'ALL'}
          onClick={() => setSelectedCategory('ALL')}
        >
          <span>🍽️ الكل</span>
          <span
            style={{
              background: selectedCategory === 'ALL' ? '#FFFFFF' : '#CBD5E1',
              color: selectedCategory === 'ALL' ? '#F06436' : '#1E293B',
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            {allItems.length}
          </span>
        </CategoryCardBtn>

        {categories.map((c) => {
          const count = allItems.filter((i) => i.categoryId === c.id).length;
          const isSelected = selectedCategory === c.id;
          return (
            <CategoryCardBtn
              key={c.id}
              $active={isSelected}
              onClick={() => setSelectedCategory(c.id)}
            >
              <span>{c.name}</span>
              <span
                style={{
                  background: isSelected ? '#FFFFFF' : '#CBD5E1',
                  color: isSelected ? '#F06436' : '#1E293B',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {count}
              </span>
            </CategoryCardBtn>
          );
        })}
      </CategoriesBar>

      <FilterAndSearchRow>
        <span style={{ fontSize: 14, color: '#64748B', fontWeight: 600 }}>
          عرض {items.length} صنف غذائي
        </span>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="بحث باسم الوجبة أو الوصف..."
          width={280}
        />
      </FilterAndSearchRow>

      {loading ? (
        <LoadingState tip="جاري تحميل قائمة الطعام..." />
      ) : items.length === 0 ? (
        <EmptyState description="لا توجد أكلات مطابقة للبحث أو التصنيف المحدد" />
      ) : (
        <MenuGrid>
          {items.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </MenuGrid>
      )}

      {/* Food item modal */}
      <MenuItemModal
        open={modalOpen}
        item={editingItem}
        categories={categories}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={async (data) => {
          if (editingItem) {
            const res = await updateItem(editingItem.id, data);
            return Boolean(res);
          } else {
            const res = await createItem(data);
            return Boolean(res);
          }
        }}
      />

      {/* Category modal */}
      <AddCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
