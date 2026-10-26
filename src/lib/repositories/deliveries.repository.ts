import { prisma } from '@/lib/db/prisma';
import type { Delivery, DeliveryStatus } from '@/types';
import { DELIVERY_STATUS_TRANSITIONS } from '@/types';

async function mapDelivery(row: {
  id: string;
  orderId: string;
  recipientName: string;
  phone: string;
  address: string;
  status: string;
  bikeNumber?: number | null;
  assignedStaffId: string | null;
  createdAt: Date;
  updatedAt: Date;
  order: {
    orderNumber: number;
    total: number;
    items: { menuItemName: string; quantity: number }[];
  };
  assignedStaff: { name: string } | null;
}): Promise<Delivery> {
  return {
    id: row.id,
    orderId: row.orderId,
    orderNumber: row.order.orderNumber,
    recipientName: row.recipientName,
    phone: row.phone,
    address: row.address,
    status: row.status as DeliveryStatus,
    bikeNumber: row.bikeNumber ?? 1,
    assignedStaffId: row.assignedStaffId,
    assignedStaffName: row.assignedStaff?.name ?? null,
    orderTotal: row.order.total,
    orderItems: row.order.items.map((i) => ({
      name: i.menuItemName,
      quantity: i.quantity,
    })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const deliveryInclude = {
  order: {
    select: {
      orderNumber: true,
      total: true,
      items: { select: { menuItemName: true, quantity: true } },
    },
  },
  assignedStaff: { select: { name: true } },
};

export const deliveriesRepository = {
  async findAll(filter?: DeliveryStatus): Promise<Delivery[]> {
    const rows = await prisma.delivery.findMany({
      where: filter ? { status: filter } : {},
      include: deliveryInclude,
      orderBy: { createdAt: 'desc' },
    });
    return Promise.all(rows.map(mapDelivery));
  },

  async findById(id: string): Promise<Delivery | null> {
    const row = await prisma.delivery.findUnique({
      where: { id },
      include: deliveryInclude,
    });
    return row ? mapDelivery(row) : null;
  },

  async updateStatus(id: string, status: DeliveryStatus, assignedStaffId?: string): Promise<Delivery> {
    const existing = await prisma.delivery.findUnique({ where: { id } });
    if (!existing) throw new Error('طلب التوصيل غير موجود');

    const allowed = DELIVERY_STATUS_TRANSITIONS[existing.status as DeliveryStatus];
    if (!allowed.includes(status)) {
      throw new Error(`لا يمكن تغيير حالة التوصيل من "${existing.status}" إلى "${status}"`);
    }

    const row = await prisma.delivery.update({
      where: { id },
      data: {
        status,
        ...(assignedStaffId ? { assignedStaffId } : {}),
      },
      include: deliveryInclude,
    });

    return mapDelivery(row);
  },
};
