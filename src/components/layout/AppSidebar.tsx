"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import { Drawer, message } from "antd";
import {
  OrderedListOutlined,
  AppstoreOutlined,
  FireOutlined,
  BookOutlined,
  CarOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import navigationData from "@/data/navigation.json";
import type { UserRole } from "@/types";

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  desktopOpen?: boolean;
  onDesktopToggle?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  OrderedListOutlined: <OrderedListOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  FireOutlined: <FireOutlined />,
  BookOutlined: <BookOutlined />,
  CarOutlined: <CarOutlined />,
};

const DesktopSidebarContainer = styled.aside`
  width: 250px;
  min-width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.sidebarBg};
  color: ${({ theme }) => theme.colors.sidebarText};
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  z-index: 100;
  user-select: none;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #172a43;
  color: #94a3b8;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  border-bottom: 1px solid #1e3a5f;
`;

const BrandLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-color: #f06436;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.h1`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`;

const BrandTagline = styled.span`
  color: #f06436;
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
`;

const NavItemLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#94A3B8")};
  background-color: ${({ $active }) => ($active ? "#F06436" : "transparent")};
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#F06436" : "rgba(255, 255, 255, 0.05)"};
    color: #ffffff;
  }

  .anticon {
    font-size: 18px;
    color: ${({ $active }) => ($active ? "#FFFFFF" : "inherit")};
  }
`;

const BottomSection = styled.div`
  padding: 16px 12px;
  border-top: 1px solid #1e3a5f;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BottomButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? "#EF4444" : "#94A3B8")};
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: right;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $danger }) =>
      $danger ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.05)"};
    color: ${({ $danger }) => ($danger ? "#DC2626" : "#FFFFFF")};
  }

  .anticon {
    font-size: 16px;
  }
`;

const CloseDrawerButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export function AppSidebar({
  mobileOpen = false,
  onMobileClose,
  desktopOpen = false,
  onDesktopToggle,
}: AppSidebarProps) {
  // Removed internal desktopOpen state; using prop

  // Desktop sidebar open state – default closed


  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: UserRole })?.role;

  const filteredNav = navigationData.filter((item) => {
    if (!userRole) return true;
    return item.allowedRoles.includes(userRole);
  });

  const renderContent = (isMobile = false) => (
    <SidebarInner>
      <BrandSection>
        <BrandLeft>
          <LogoWrapper>
            <Image
              src="/images/logo/logo.jpg"
              alt="مطعمنا"
              width={44}
              height={44}
              style={{ objectFit: "cover" }}
              priority
            />
          </LogoWrapper>
          <BrandText>
            <BrandName>HumHum</BrandName>
            <BrandTagline>طعم لا يُنسى</BrandTagline>
          </BrandText>
        </BrandLeft>

        {isMobile && onMobileClose && (
          <CloseDrawerButton onClick={onMobileClose}>
            <CloseOutlined />
          </CloseDrawerButton>
        )}
      </BrandSection>

      <NavSection>
        {filteredNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <NavItemLink
              key={item.id}
              href={item.href}
              $active={isActive}
              onClick={() => {
                if (isMobile && onMobileClose) onMobileClose();
              }}
            >
              {iconMap[item.icon]}
              <span>{item.label}</span>
            </NavItemLink>
          );
        })}
      </NavSection>

      <BottomSection>
        <BottomButton
          type="button"
          onClick={() => {
            if (isMobile && onMobileClose) onMobileClose();
            router.push('/settings');
          }}
        >
          <SettingOutlined />
          <span>الإعدادات</span>
        </BottomButton>
        <BottomButton
          type="button"
          $danger
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogoutOutlined />
          <span>تسجيل الخروج</span>
        </BottomButton>
      </BottomSection>
    </SidebarInner>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      {desktopOpen && <DesktopSidebarContainer>{renderContent(false)}</DesktopSidebarContainer>}

      {/* Mobile / Tablet Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        placement="right"
        width={280}
        styles={{
          body: { padding: 0, backgroundColor: "#172A43" },
          header: { display: "none" },
        }}
        closable={false}
      >
        {renderContent(true)}
      </Drawer>
    </>
  );
}
