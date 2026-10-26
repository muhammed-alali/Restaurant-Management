'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.appBackground};
  direction: rtl;
`;

const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  const handleDesktopToggle = () => setDesktopOpen(prev => !prev);

  return (
    <LayoutWrapper>
      <AppSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        desktopOpen={desktopOpen}
        onDesktopToggle={handleDesktopToggle}
      />
      <MainContentArea>
        <AppHeader onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)} onDesktopToggle={handleDesktopToggle} desktopOpen={desktopOpen} />
        <ContentContainer>{children}</ContentContainer>
      </MainContentArea>
    </LayoutWrapper>
  );
}
