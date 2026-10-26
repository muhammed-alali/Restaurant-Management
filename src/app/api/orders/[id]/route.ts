import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { ordersService } from '@/lib/services/orders.service';
import { updateOrderStatusSchema } from '@/lib/validations/order.validation';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const order = await ordersService.getOrderById(id);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر جلب الطلب';
    return NextResponse.json({ success: false, error: message }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'orders:status:update') && !hasPermission(role, 'kitchen:status:update')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتغيير حالة الطلب' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { id } = await params;
    const order = await ordersService.updateOrderStatus(id, parsed.data.status);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تحديث الطلب';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
