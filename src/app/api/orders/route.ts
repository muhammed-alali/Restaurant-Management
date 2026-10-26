import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { ordersService } from '@/lib/services/orders.service';
import { createOrderSchema } from '@/lib/validations/order.validation';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole, OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;

    const orders = await ordersService.getOrders(status ? { status } : undefined);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json({ success: false, error: 'تعذر جلب الطلبات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'orders:create')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بإنشاء طلبات' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const order = await ordersService.createOrder(parsed.data);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ البيانات، حاول مرة أخرى';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
