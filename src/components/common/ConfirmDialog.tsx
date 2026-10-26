'use client';

import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  content,
  okText = 'تأكيد',
  cancelText = 'إلغاء',
  okDanger = false,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: okDanger ? '#DC2626' : '#F59E0B' }} />
          <span>{title}</span>
        </span>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: okDanger, loading }}
      centered
      destroyOnHidden
    >
      <p style={{ color: '#64748B', margin: '16px 0 8px 0', fontSize: '14px' }}>
        {content}
      </p>
    </Modal>
  );
}
