import { prisma } from '@/lib/db/prisma';
import type { RestaurantTable, TableStatus } from '@/types';

async function mapTableRow(row: {
  id: string;
  number: number;
  capacity: number;
  status: string;
  createdAt: Date;
  orders: { id: string; orderNumber: number; total: number; status: string; createdAt: Date }[];
}): Promise<RestaurantTable> {
  const activeOrder = row.orders.find(
    (o) => o.status === 'NEW' || o.status === 'PREPARING' || o.status === 'READY',
  );

  let realStatus = row.status as TableStatus;

  // Self-heal table status if inconsistent with active orders
  if (row.status === 'OCCUPIED' && !activeOrder) {
    realStatus = 'AVAILABLE';
    prisma.restaurantTable
      .update({ where: { id: row.id }, data: { status: 'AVAILABLE' } })
      .catch(() => {});
  } else if (row.status === 'AVAILABLE' && activeOrder) {
    realStatus = 'OCCUPIED';
    prisma.restaurantTable
      .update({ where: { id: row.id }, data: { status: 'OCCUPIED' } })
      .catch(() => {});
  }

  return {
    id: row.id,
    number: row.number,
    capacity: row.capacity,
    status: realStatus,
    activeOrderId: activeOrder?.id ?? null,
    activeOrderNumber: activeOrder?.orderNumber ?? null,
    activeOrderTotal: activeOrder?.total ?? null,
    occupiedSince: activeOrder?.createdAt ?? null,
    createdAt: row.createdAt,
  };
}

export const tablesRepository = {
  async findAll(filter?: TableStatus): Promise<RestaurantTable[]> {
    const rows = await prisma.restaurantTable.findMany({
      include: {
        orders: {
          where: { status: { in: ['NEW', 'PREPARING', 'READY'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { number: 'asc' },
    });
    const mapped = await Promise.all(rows.map(mapTableRow));
    if (filter) {
      return mapped.filter((t) => t.status === filter);
    }
    return mapped;
  },

  async findById(id: string): Promise<RestaurantTable | null> {
    const row = await prisma.restaurantTable.findUnique({
      where: { id },
      include: {
        orders: {
          where: { status: { in: ['NEW', 'PREPARING', 'READY'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return row ? mapTableRow(row) : null;
  },

  async create(data: { number: number; capacity: number }): Promise<RestaurantTable> {
    const row = await prisma.restaurantTable.create({
      data: { ...data, status: 'AVAILABLE' },
      include: { orders: true },
    });
    return mapTableRow(row);
  },

  async update(id: string, data: { capacity?: number; status?: TableStatus }): Promise<RestaurantTable> {
    const row = await prisma.restaurantTable.update({
      where: { id },
      data,
      include: {
        orders: {
          where: { status: { in: ['NEW', 'PREPARING', 'READY'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return mapTableRow(row);
  },

  async delete(id: string): Promise<void> {
    await prisma.restaurantTable.delete({ where: { id } });
  },
};
