"use client";

import React from "react";
import styled from "styled-components";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    margin-bottom: 16px;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    width: 100%;

    .ant-space {
      width: 100%;
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 8px !important;

      .ant-space-item {
        width: 100%;

        button {
          width: 100%;
          height: 36px;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
`;

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <HeaderWrapper>
      <div>
        <TitleGroup>
          <Title>{title}</Title>
          {badge}
        </TitleGroup>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
      {actions && <ActionsGroup>{actions}</ActionsGroup>}
    </HeaderWrapper>
  );
}
