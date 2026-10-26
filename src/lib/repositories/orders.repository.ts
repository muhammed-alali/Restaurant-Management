import { prisma } from '@/lib/db/prisma';
import type { Order, OrderStatus, OrderType } from '@/types';

function mapOrderRow(row: {
  id: string;
  orderNumber: number;
  type: string;
  status: string;
  tableId: string | null;
  notes: string | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  table: { number: number } | null;
  items: {
    id: string;
    orderId: string;
    menuItemId: string;
    menuItemName: string;
    unitPrice: number;
    quantity: number;
    notes: string | null;
  }[];
}): Order {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    type: row.type as OrderType,
    status: row.status as OrderStatus,
    tableId: row.tableId,
    tableNumber: row.table?.number ?? null,
    notes: row.notes,
    total: row.total,
    items: row.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      menuItemId: item.menuItemId,
      menuItemName: item.menuItemName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      notes: item.notes,
    })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const orderInclude = {
  table: { select: { number: true } },
  items: true,
};

export const ordersRepository = {
  async findAll(filters?: { status?: OrderStatus; type?: OrderType }): Promise<Order[]> {
    const rows = await prisma.order.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.type ? { type: filters.type } : {}),
      },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(mapOrderRow);
  },

  async findById(id: string): Promise<Order | null> {
    const row = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    return row ? mapOrderRow(row) : null;
  },

  async findByStatuses(statuses: OrderStatus[]): Promise<Order[]> {
    const rows = await prisma.order.findMany({
      where: { status: { in: statuses } },
      include: orderInclude,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapOrderRow);
  },

  async create(data: {
    type: OrderType;
    tableId?: string;
    notes?: string;
    total: number;
    items: {
      menuItemId: string;
      menuItemName: string;
      unitPrice: number;
      quantity: number;
      notes?: string;
    }[];
  }): Promise<Order> {
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    });
    const orderNumber = (lastOrder?.orderNumber ?? 100) + 1;

    const row = await prisma.order.create({
      data: {
        orderNumber,
        type: data.type,
        status: 'NEW',
        tableId: data.tableId,
        notes: data.notes,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            menuItemName: item.menuItemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: orderInclude,
    });
    return mapOrderRow(row);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const row = await prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
    return mapOrderRow(row);
  },
};
