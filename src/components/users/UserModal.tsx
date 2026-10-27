'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { UserRole } from '@/types';

interface UserModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
  } | null;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    username: string;
    password?: string;
    role: UserRole;
  }) => Promise<boolean>;
}

const FormWrapper = styled.div`
  padding: 4px 0;

  .ant-form-item-label > label {
    font-weight: 600;
  }
`;

const RoleOptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const RoleLabel = styled.span`
  font-weight: 600;
  color: #172033;
  white-space: nowrap;
`;

const RoleDesc = styled.span`
  font-size: 12px;
  color: #64748B;
  text-align: left;
  white-space: nowrap;
`;

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'ADMIN', label: 'مدير النظام', description: 'صلاحيات كاملة على جميع الأقسام' },
  { value: 'STAFF', label: 'كاشير / صالة', description: 'إدارة الطلبات والطاولات والمنيو' },
  { value: 'CHEF', label: 'شيف المطبخ', description: 'متابعة شاشات المطبخ وتحديث الحالات' },
  { value: 'DELIVERY_STAFF', label: 'مندوب توصيل', description: 'متابعة طلبات التوصيل وتحديث حالتها' },
];

export function UserModal({ open, mode, user, onClose, onSubmit }: UserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (mode === 'edit' && user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        role: user.role,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ role: 'STAFF' });
    }
  }, [open, mode, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const success = await onSubmit(values);
      if (success) {
        form.resetFields();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
          <TeamOutlined style={{ color: '#F06436', fontSize: 20 }} />
          <span>{mode === 'create' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}</span>
        </div>
      }
      width={520}
      centered
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>إلغاء</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
          >
            {mode === 'create' ? 'إضافة المستخدم' : 'حفظ التغييرات'}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <FormWrapper>
        <Form form={form} layout="vertical" requiredMark={false}>
          <style jsx global>{`
            .role-select .ant-select-selection-item {
              display: flex !important;
              align-items: center;
            }
            .role-select .ant-select-selection-item .role-option-row {
              width: 100%;
            }
          `}</style>
          <Form.Item
            name="name"
            label="الاسم الكامل"
            rules={[{ required: true, message: 'يرجى إدخال الاسم الكامل' }]}
          >
            <Input prefix={<IdcardOutlined style={{ color: '#94A3B8' }} />} placeholder="مثال: أحمد محمد" size="large" />
          </Form.Item>

          <Form.Item
            name="username"
            label="اسم المستخدم"
            rules={[{ required: true, message: 'يرجى إدخال اسم المستخدم' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#94A3B8' }} />} placeholder="أحرف وأرقام فقط" size="large" autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="password"
            label={mode === 'create' ? 'كلمة المرور' : 'كلمة المرور الجديدة (اختياري)'}
            rules={mode === 'create' ? [{ required: true, message: 'يرجى إدخال كلمة المرور' }] : []}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
              placeholder={mode === 'create' ? 'أدخل كلمة المرور' : 'اتركه فارغاً إذا لم تريد التغيير'}
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="صلاحية المستخدم"
            rules={[{ required: true, message: 'يرجى اختيار الصلاحية' }]}
          >
            <Select
              size="large"
              placeholder="اختر صلاحية المستخدم"
              optionLabelProp="label"
              className="role-select"
              dropdownStyle={{ minWidth: 420 }}
            >
              {roleOptions.map((option) => (
                <Select.Option key={option.value} value={option.value} label={option.label}>
                  <RoleOptionRow className="role-option-row">
                    <RoleLabel>{option.label}</RoleLabel>
                    <RoleDesc>{option.description}</RoleDesc>
                  </RoleOptionRow>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </FormWrapper>
    </Modal>
  );
}
