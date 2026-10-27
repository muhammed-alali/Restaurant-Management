'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Space, Tag, Table, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { UserModal } from '@/components/users/UserModal';
import { useUsers } from '@/hooks/useUsers';
import type { UserRole } from '@/types';
import { useSession } from 'next-auth/react';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #FFFFFF;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardIconWrapper = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF3EF 0%, #FFE4DC 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F06436;
  font-size: 20px;
`;

const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardTitleText = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #172033;
  margin: 0;
`;

const CardSubtitle = styled.span`
  font-size: 12px;
  color: #64748B;
`;

const TableWrapper = styled.div`
  padding: 0 24px 24px;

  @media (max-width: 640px) {
    padding: 0 12px 12px;
  }

  .ant-table-wrapper {
    overflow-x: auto;
  }

  .ant-pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #172033;
`;

const UserUsername = styled.span`
  font-size: 12px;
  color: #64748B;
`;

const roleConfig: Record<UserRole, { label: string; color: string; bg: string }> = {
  ADMIN: { label: 'مدير النظام', color: '#DC2626', bg: '#FEF2F2' },
  STAFF: { label: 'كاشير / صالة', color: '#2563EB', bg: '#EFF6FF' },
  CHEF: { label: 'شيف المطبخ', color: '#F59E0B', bg: '#FFFBEB' },
  DELIVERY_STAFF: { label: 'مندوب توصيل', color: '#16A34A', bg: '#F0FDF4' },
};

export function UsersView() {
  const { users, loading, refresh, createUser, updateUser, deleteUser } = useUsers();
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleAdd = () => {
    setSelectedUser(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    if (modalMode === 'create') {
      return createUser(values);
    }
    if (modalMode === 'edit' && selectedUser) {
      const payload: any = { ...values };
      if (!payload.password) delete payload.password;
      return updateUser(selectedUser.id, payload);
    }
    return false;
  };

  const columns = [
    {
      title: 'المستخدم',
      key: 'user',
      render: (_: any, record: any) => (
        <UserCell>
          <Avatar>
            <UserOutlined />
          </Avatar>
          <UserInfo>
            <UserName>{record.name}</UserName>
            <UserUsername>@{record.username}</UserUsername>
          </UserInfo>
        </UserCell>
      ),
    },
    {
      title: 'الصلاحية',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        const config = roleConfig[role];
        return (
          <Tag
            style={{
              backgroundColor: config.bg,
              color: config.color,
              border: 'none',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 9999,
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'تاريخ الإضافة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ color: '#64748B' }}>
          {new Date(date).toLocaleDateString('ar-EG')}
        </span>
      ),
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size={8}>
          <Tooltip title="تعديل">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#2563EB' }}
            />
          </Tooltip>
          <Popconfirm
            title="حذف المستخدم"
            description={
              record.id === currentUserId
                ? 'لا يمكنك حذف حسابك الخاص'
                : 'هل أنت متأكد من حذف هذا المستخدم؟'
            }
            okText="حذف"
            cancelText="إلغاء"
            okButtonProps={{ danger: true, disabled: record.id === currentUserId }}
            onConfirm={() => deleteUser(record.id)}
            disabled={record.id === currentUserId}
          >
            <Tooltip title={record.id === currentUserId ? 'لا يمكن حذف حسابك' : 'حذف'}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.id === currentUserId}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="إدارة المستخدمين"
        subtitle="إضافة وتعديل وحذف حسابات الموظفين مع تحديد الصلاحيات"
        badge={
          <Tag color="orange" icon={<TeamOutlined />}>
            {users.length} مستخدم
          </Tag>
        }
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refresh()} loading={loading}>
              تحديث
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
            >
              إضافة مستخدم
            </Button>
          </Space>
        }
      />

      <Card>
        <CardHeader>
          <CardTitleGroup>
            <CardIconWrapper>
              <TeamOutlined />
            </CardIconWrapper>
            <CardTitle>
              <CardTitleText>قائمة المستخدمين</CardTitleText>
              <CardSubtitle>جميع حسابات الموظفين والصلاحيات الممنوحة</CardSubtitle>
            </CardTitle>
          </CardTitleGroup>
        </CardHeader>
        <TableWrapper>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              hideOnSinglePage: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} من ${total}`,
            }}
            scroll={{ x: 640 }}
            locale={{ emptyText: 'لا يوجد مستخدمين بعد' }}
          />
        </TableWrapper>
      </Card>

      <UserModal
        open={modalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
