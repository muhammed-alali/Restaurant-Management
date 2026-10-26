import type { UserRole } from '@/types';

/**
 * Centralized authorization policy.
 * All permission checks should go through this module.
 */

export type Permission =
  | 'orders:create'
  | 'orders:view'
  | 'orders:cancel'
  | 'orders:status:update'
  | 'kitchen:view'
  | 'kitchen:status:update'
  | 'tables:view'
  | 'tables:manage'
  | 'menu:view'
  | 'menu:manage'
  | 'deliveries:view'
  | 'deliveries:status:update'
  | 'settings:manage'
  | 'users:manage';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'orders:create', 'orders:view', 'orders:cancel', 'orders:status:update',
    'kitchen:view', 'kitchen:status:update',
    'tables:view', 'tables:manage',
    'menu:view', 'menu:manage',
    'deliveries:view', 'deliveries:status:update',
    'settings:manage', 'users:manage',
  ],
  STAFF: [
    'orders:create', 'orders:view', 'orders:cancel', 'orders:status:update',
    'kitchen:view',
    'tables:view',
    'menu:view',
    'deliveries:view', 'deliveries:status:update',
  ],
  CHEF: [
    'orders:view',
    'kitchen:view', 'kitchen:status:update',
    'tables:view',
    'menu:view',
  ],
  DELIVERY_STAFF: [
    'orders:view',
    'deliveries:view', 'deliveries:status:update',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertPermission(role: UserRole | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error('غير مصرح لك بتنفيذ هذا الإجراء');
  }
}
