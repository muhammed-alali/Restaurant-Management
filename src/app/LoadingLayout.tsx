"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Spin } from 'antd';
import styled from 'styled-components';
import { Providers } from './providers';

interface LoadingLayoutProps {
  children: React.ReactNode;
}

export default function LoadingLayout({ children }: LoadingLayoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Show overlay on initial mount
  useEffect(() => {
    setIsLoading(true);
    const initTimer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(initTimer);
  }, []);

  // Show overlay on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  const Overlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    z-index: 9999;
  `;
  return (
    <>
      {isLoading && (
        <Overlay>
          <Spin size="large" />
        </Overlay>
      )}
      {!isLoading && <Providers>{children}</Providers>}
    </>
  );


}
