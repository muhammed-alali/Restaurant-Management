'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export function AddCategoryModal({ open, onClose, onSubmit }: AddCategoryModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { name: string }) => {
    setLoading(true);
    const success = await onSubmit(values.name);
    setLoading(false);
    if (success) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
          <AppstoreAddOutlined style={{ color: '#F06436' }} />
          <span>إضافة فئة طعام جديدة</span>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={420}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label="اسم الفئة الجديدة"
          rules={[{ required: true, message: 'يرجى إدخال اسم الفئة' }]}
        >
          <Input placeholder="مثال: مشروبات ساخنة، حلويات، شوربات..." size="large" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={onClose} size="middle">
            إلغاء
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="middle"
            style={{ backgroundColor: '#F06436', borderColor: '#F06436', fontWeight: 600 }}
          >
            حفظ الفئة
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
