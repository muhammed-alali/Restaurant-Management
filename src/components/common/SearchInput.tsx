'use client';

import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
  className?: string;
}

const StyledInput = styled(Input)<{ $width?: string | number }>`
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '280px')};
  max-width: 100%;
  border-radius: 8px;
  height: 40px;
  font-size: 13px;

  .ant-input-prefix {
    margin-inline-end: 8px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export function SearchInput({
  value,
  onChange,
  placeholder = 'بحث...',
  width,
  className,
}: SearchInputProps) {
  return (
    <StyledInput
      $width={width}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      allowClear
      className={className}
    />
  );
}
