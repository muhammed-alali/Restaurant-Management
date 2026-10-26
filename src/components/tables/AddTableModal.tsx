'use client';

import React, { useState } from 'react';
import { Modal, Form, InputNumber, Button } from 'antd';

interface AddTableModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { number: number; capacity: number }) => Promise<boolean>;
}

export function AddTableModal({ open, onClose, onSubmit }: AddTableModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: { number: number; capacity: number }) => {
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);

    if (success) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={<span style={{ fontWeight: 700, fontSize: 18 }}>إضافة طاولة جديدة</span>}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ capacity: 4 }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="number"
          label="رقم الطاولة"
          rules={[{ required: true, message: 'يرجى إدخال رقم الطاولة' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="مثال: 17" />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="عدد المقاعد (السعة)"
          rules={[{ required: true, message: 'يرجى تحديد السعة' }]}
        >
          <InputNumber min={1} max={20} style={{ width: '100%' }} placeholder="مثال: 4" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={onClose}>إلغاء</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
          >
            إضافة الطاولة
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
