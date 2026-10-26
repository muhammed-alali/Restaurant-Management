import type { ThemeConfig } from 'antd';

// ─── Brand Colors ─────────────────────────────────────────────────
export const colors = {
  // Primary brand
  primaryOrange: '#F06436',
  primaryOrangeHover: '#E65328',
  primaryOrangeLight: '#FFF3EF',

  // Secondary / action
  primaryBlue: '#2563EB',
  primaryBlueMuted: '#3B82F6',
  lightBlue: '#EFF6FF',

  // Sidebar / nav
  sidebarBg: '#172A43',
  sidebarText: '#94A3B8',
  sidebarTextActive: '#FFFFFF',
  sidebarActiveItem: '#F06436',
  sidebarBorder: '#1E3A5F',
  sidebarIconColor: '#64748B',

  // Backgrounds
  appBackground: '#F5F7FA',
  surfaceWhite: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceHover: '#F8FAFC',

  // Text
  textPrimary: '#172033',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textDisabled: '#CBD5E1',

  // Border
  border: '#E5E7EB',
  borderLight: '#F1F5F9',
  borderFocus: '#F06436',

  // Status - Orders
  statusNew: '#F59E0B',
  statusNewBg: '#FFFBEB',
  statusNewBorder: '#FDE68A',
  statusNewText: '#92400E',

  statusPreparing: '#2563EB',
  statusPreparingBg: '#EFF6FF',
  statusPreparingBorder: '#BFDBFE',
  statusPreparingText: '#1D4ED8',

  statusReady: '#16A34A',
  statusReadyBg: '#F0FDF4',
  statusReadyBorder: '#BBF7D0',
  statusReadyText: '#15803D',

  statusCompleted: '#6B7280',
  statusCompletedBg: '#F9FAFB',
  statusCompletedBorder: '#E5E7EB',
  statusCompletedText: '#4B5563',

  statusCancelled: '#DC2626',
  statusCancelledBg: '#FEF2F2',
  statusCancelledBorder: '#FECACA',
  statusCancelledText: '#B91C1C',

  // Table status
  tableAvailable: '#16A34A',
  tableAvailableBg: '#F0FDF4',
  tableOccupied: '#2563EB',
  tableOccupiedBg: '#EFF6FF',
  tableReserved: '#F59E0B',
  tableReservedBg: '#FFFBEB',

  // Functional
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2563EB',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const;

// ─── Border Radius ────────────────────────────────────────────────
export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────
export const shadows = {
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
  cardHover: '0 4px 12px 0 rgba(0, 0, 0, 0.10)',
  modal: '0 20px 60px rgba(0, 0, 0, 0.15)',
  sidebar: '2px 0 8px rgba(0, 0, 0, 0.08)',
} as const;

// ─── Typography ───────────────────────────────────────────────────
export const typography = {
  fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif",
  fontSizeXs: '11px',
  fontSizeSm: '12px',
  fontSizeMd: '13px',
  fontSizeBase: '14px',
  fontSizeLg: '16px',
  fontSizeXl: '18px',
  fontSize2xl: '22px',
  fontSize3xl: '28px',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
} as const;

// ─── Layout ───────────────────────────────────────────────────────
export const layout = {
  sidebarWidth: '240px',
  headerHeight: '64px',
  contentPadding: '24px',
} as const;

// ─── Ant Design Theme Config ──────────────────────────────────────
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primaryOrange,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorBgBase: colors.appBackground,
    colorBgContainer: colors.surfaceWhite,
    colorBorder: colors.border,
    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextDisabled: colors.textDisabled,
    borderRadius: 8,
    borderRadiusSM: 4,
    borderRadiusLG: 12,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    lineHeight: 1.6,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      colorPrimary: colors.primaryOrange,
      colorPrimaryHover: colors.primaryOrangeHover,
      borderRadius: 8,
      controlHeight: 40,
    },
    Table: {
      headerBg: colors.surfaceWhite,
      headerColor: colors.textSecondary,
      rowHoverBg: colors.surfaceHover,
      borderColor: colors.border,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 12,
    },
    Drawer: {},
    Tag: {
      borderRadius: 20,
    },
  },
};

// ─── Styled Components Theme ──────────────────────────────────────
export const styledTheme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
  layout,
};

export const appTheme = styledTheme;

export type StyledTheme = typeof styledTheme;

// Augment styled-components DefaultTheme
declare module 'styled-components' {
  interface DefaultTheme extends StyledTheme {}
}
