'use client';

import React from 'react';
import { Empty } from 'antd';
import styled from 'styled-components';

interface EmptyStateProps {
  description?: string;
  action?: React.ReactNode;
}

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  background: ${({ theme }) => theme.colors.surfaceWhite};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export function EmptyState({
  description = 'لا توجد بيانات متوفرة حالياً',
  action,
}: EmptyStateProps) {
  return (
    <EmptyWrapper>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span style={{ color: '#64748B', fontSize: '14px' }}>{description}</span>}
      >
        {action}
      </Empty>
    </EmptyWrapper>
  );
}
