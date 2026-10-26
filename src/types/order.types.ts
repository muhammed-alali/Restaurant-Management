export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  tableId?: string | null;
  tableNumber?: number | null;
  notes?: string | null;
  total: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderPayload {
  type: OrderType;
  tableId?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
  }[];
  delivery?: {
    recipientName: string;
    phone: string;
    address: string;
    bikeNumber?: number;
  };
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'جديد',
  PREPARING: 'قيد التحضير',
  READY: 'جاهز',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  DINE_IN: 'داخل المطعم',
  TAKEAWAY: 'استلام',
  DELIVERY: 'توصيل',
};

// Valid status transitions
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PREPARING', 'READY', 'CANCELLED'],
  PREPARING: ['NEW', 'READY', 'CANCELLED'],
  READY: ['NEW', 'PREPARING', 'COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};
