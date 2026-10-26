"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import type { UserRole } from "@/types";

interface AppHeaderProps {
  onMobileMenuToggle?: () => void;
  onDesktopToggle?: () => void;
  desktopOpen?: boolean;
}

const DesktopMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  @media (min-width: 1025px) {
    display: flex;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const HeaderContainer = styled.header`
  height: 64px;
  background-color: #f5f7fa;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 90;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #16a34a;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const ClockText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.borderLight};
  padding: 4px 10px;
  border-radius: 6px;
  font-variant-numeric: tabular-nums;

  @media (max-width: 500px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryOrangeLight};
  color: ${({ theme }) => theme.colors.primaryOrange};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserRoleBadge = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const roleLabels: Record<UserRole, string> = {
  ADMIN: "مدير النظام",
  STAFF: "كاشير / صالة",
  CHEF: "شيف المطبخ",
  DELIVERY_STAFF: "مندوب توصيل",
};

export function AppHeader(props: AppHeaderProps) {
  const { onMobileMenuToggle, onDesktopToggle, desktopOpen } = props;
  const { data: session } = useSession();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const user = session?.user as { name?: string; role?: UserRole } | undefined;
  const roleName = user?.role ? roleLabels[user.role] : "موظف";

  return (
    <HeaderContainer>
      <LeftSide>
        <MobileMenuButton onClick={onMobileMenuToggle} aria-label="فتح القائمة">
          <MenuOutlined />
        </MobileMenuButton>
        <DesktopMenuButton
          onClick={onDesktopToggle}
          aria-label={
            desktopOpen ? "إغلاق الشريط الجانبي" : "فتح الشريط الجانبي"
          }
        >
          {desktopOpen ? <CloseOutlined /> : <MenuOutlined />}
        </DesktopMenuButton>
        <StatusIndicator>
          <span className="dot" />
          {/* <span>الخادم متصل (POS-Node-01)</span> */}
        </StatusIndicator>
      </LeftSide>

      <RightSide>
        {/* {time && <ClockText>{time}</ClockText>} */}
        <UserProfile>
          <UserAvatar>
            <UserOutlined />
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.name || "مستخدم"}</UserName>
            <UserRoleBadge>{roleName}</UserRoleBadge>
          </UserDetails>
        </UserProfile>
      </RightSide>
    </HeaderContainer>
  );
}
