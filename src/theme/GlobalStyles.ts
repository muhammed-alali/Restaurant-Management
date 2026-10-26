'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* ── Font Registration ───────────────────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');

  /* ── Reset & Defaults ────────────────────────────────── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    direction: rtl;
    font-size: 14px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.appBackground};
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: right;
  }

  /* ── Ant Design Component Responsive Adjustments ────────── */
  .ant-segmented {
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .ant-segmented::-webkit-scrollbar {
    display: none;
  }
  .ant-segmented .ant-segmented-group {
    max-width: 100%;
  }

  /* ── RTL Adjustments ─────────────────────────────────── */
  /* Ant Design RTL overrides */
  .ant-table-thead > tr > th {
    text-align: right !important;
  }

  .ant-form-item-label {
    text-align: right !important;
  }

  .ant-modal-close {
    inset-inline-start: 0 !important;
    inset-inline-end: auto !important;
    left: 20px !important;
    right: auto !important;
  }

  /* ── Scrollbar Styles ────────────────────────────────── */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.borderLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }

  /* ── Utility ─────────────────────────────────────────── */
  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  /* Kitchen view scrollbar */
  .kitchen-columns-container {
    scrollbar-width: thin;
  }
`;
