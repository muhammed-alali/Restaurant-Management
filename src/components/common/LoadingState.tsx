'use client';

import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

interface LoadingStateProps {
  tip?: string;
}

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 16px;
  min-height: 200px;
  gap: 16px;
`;

export function LoadingState({ tip = 'جاري التحميل...' }: LoadingStateProps) {
  return (
    <LoadingWrapper>
      <Spin size="large" />
      <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>{tip}</div>
    </LoadingWrapper>
  );
}
