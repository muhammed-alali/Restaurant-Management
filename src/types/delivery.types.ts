export type DeliveryStatus =
  | 'NEW'
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: number;
  recipientName: string;
  phone: string;
  address: string;
  status: DeliveryStatus;
  bikeNumber?: number | null;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  orderTotal: number;
  orderItems: { name: string; quantity: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateDeliveryStatusPayload {
  status: DeliveryStatus;
  assignedStaffId?: string;
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  NEW: 'جديد',
  PREPARING: 'قيد التحضير',
  READY_FOR_DELIVERY: 'جاهز للتوصيل',
  OUT_FOR_DELIVERY: 'خرج للتوصيل',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
};

export const DELIVERY_STATUS_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  NEW: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};
