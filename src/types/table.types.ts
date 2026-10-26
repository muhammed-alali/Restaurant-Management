export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  activeOrderId?: string | null;
  activeOrderNumber?: number | null;
  activeOrderTotal?: number | null;
  occupiedSince?: Date | null;
  createdAt: Date;
}

export interface CreateTablePayload {
  number: number;
  capacity: number;
}

export interface UpdateTablePayload {
  number?: number;
  capacity?: number;
  status?: TableStatus;
}

export const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  AVAILABLE: 'متاحة',
  OCCUPIED: 'مشغولة',
  RESERVED: 'محجوزة',
};
