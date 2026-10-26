'use client';

import React from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AntdBridge } from '@/components/common/AntdBridge';
import arEG from 'antd/locale/ar_EG';
import { ThemeProvider } from 'styled-components';
import { SessionProvider } from 'next-auth/react';
import StyledComponentsRegistry from '@/theme/StyledComponentsRegistry';
import { antdTheme, appTheme } from '@/theme/theme';
import { GlobalStyles } from '@/theme/GlobalStyles';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <StyledComponentsRegistry>
        <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
          <AntdApp>
            <AntdBridge />
            <ThemeProvider theme={appTheme}>
              <GlobalStyles />
              {children}
            </ThemeProvider>
          </AntdApp>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </SessionProvider>
  );
}
