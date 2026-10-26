'use client';

import { useEffect } from 'react';
import { App } from 'antd';
import { setMessageInstance } from '@/lib/antdMessage';

/**
 * Mounts inside <AntdApp> and injects the context-aware message API
 * into our static proxy — so hooks can use it without warnings.
 */
export function AntdBridge() {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return null;
}
