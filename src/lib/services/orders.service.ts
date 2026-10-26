import { prisma } from '@/lib/db/prisma';
import { ordersRepository } from '@/lib/repositories/orders.repository';
import { ORDER_STATUS_TRANSITIONS } from '@/types';
import type { Order, OrderStatus, CreateOrderPayload } from '@/types';

export const ordersService = {
  async getOrders(filters?: { status?: OrderStatus }): Promise<Order[]> {
    return ordersRepository.findAll(filters);
  },

  async getOrderById(id: string): Promise<Order> {
    const order = await ordersRepository.findById(id);
    if (!order) throw new Error('الطلب غير موجود');
    return order;
  },

  async getKitchenOrders(): Promise<Order[]> {
    return ordersRepository.findByStatuses(['NEW', 'PREPARING', 'READY']);
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    // Verify table availability for dine-in
    if (payload.type === 'DINE_IN' && payload.tableId) {
      const table = await prisma.restaurantTable.findUnique({
        where: { id: payload.tableId },
        include: {
          orders: {
            where: { status: { in: ['NEW', 'PREPARING', 'READY'] } },
          },
        },
      });
      if (!table) throw new Error('الطاولة غير موجودة');

      const hasActiveOrder = table.orders.length > 0;
      if (hasActiveOrder) {
        throw new Error('الطاولة بانتظار الطعام حالياً');
      }

      // If table was marked OCCUPIED but has no active orders, self-heal to AVAILABLE
      if (table.status === 'OCCUPIED' && !hasActiveOrder) {
        await prisma.restaurantTable.update({
          where: { id: payload.tableId },
          data: { status: 'AVAILABLE' },
        });
      }
    }

    // Verify and price items from trusted DB prices
    const menuItemIds = payload.items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new Error('هذه الأكلة غير متوفرة حالياً');
    }

    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

    const orderItems = payload.items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId)!;
      return {
        menuItemId: item.menuItemId,
        menuItemName: menuItem.name,
        unitPrice: menuItem.price, // trusted server price
        quantity: item.quantity,
        notes: item.notes,
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    // Create order and update table in a transaction
    const createdOrderId = await prisma.$transaction(async (tx) => {
      const lastOrder = await tx.order.findFirst({
        orderBy: { orderNumber: 'desc' },
        select: { orderNumber: true },
      });
      const orderNumber = (lastOrder?.orderNumber ?? 100) + 1;

      const created = await tx.order.create({
        data: {
          orderNumber,
          type: payload.type,
          status: 'NEW',
          tableId: payload.tableId ?? null,
          notes: payload.notes ?? null,
          total,
          items: {
            create: orderItems,
          },
        },
      });

      if (payload.type === 'DINE_IN' && payload.tableId) {
        await tx.restaurantTable.update({
          where: { id: payload.tableId },
          data: { status: 'OCCUPIED' },
        });
      }

      if (payload.type === 'DELIVERY' && payload.delivery) {
        await tx.delivery.create({
          data: {
            orderId: created.id,
            recipientName: payload.delivery.recipientName,
            phone: payload.delivery.phone,
            address: payload.delivery.address,
            bikeNumber: payload.delivery.bikeNumber ?? 1,
            status: 'NEW',
          },
        });
      }

      return created.id;
    });

    const fullOrder = await ordersRepository.findById(createdOrderId);
    if (!fullOrder) throw new Error('فشل استرجاع الطلب المنشأ');
    return fullOrder;
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await ordersRepository.findById(id);
    if (!order) throw new Error('الطلب غير موجود');

    const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `لا يمكن تغيير الطلب من "${order.status}" إلى "${newStatus}"`,
      );
    }

    // If completing or cancelling an order tied to a table, free the table if no active orders remain
    if (
      (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') &&
      order.tableId
    ) {
      const remainingActiveOrders = await prisma.order.findMany({
        where: {
          tableId: order.tableId,
          id: { not: id },
          status: { in: ['NEW', 'PREPARING', 'READY'] },
        },
      });

      if (remainingActiveOrders.length === 0) {
        await prisma.$transaction([
          prisma.order.update({ where: { id }, data: { status: newStatus } }),
          prisma.restaurantTable.update({
            where: { id: order.tableId },
            data: { status: 'AVAILABLE' },
          }),
        ]);
      } else {
        await prisma.order.update({ where: { id }, data: { status: newStatus } });
      }
    } else {
      await prisma.order.update({ where: { id }, data: { status: newStatus } });
    }

    // Sync delivery status
    if (order.type === 'DELIVERY') {
      const deliveryStatusMap: Partial<Record<OrderStatus, string>> = {
        NEW: 'NEW',
        PREPARING: 'PREPARING',
        READY: 'READY_FOR_DELIVERY',
        CANCELLED: 'CANCELLED',
      };
      const deliveryStatus = deliveryStatusMap[newStatus];
      if (deliveryStatus) {
        await prisma.delivery.updateMany({
          where: { orderId: id },
          data: { status: deliveryStatus },
        });
      }
    }

    return ordersRepository.findById(id) as Promise<Order>;
  },
};
