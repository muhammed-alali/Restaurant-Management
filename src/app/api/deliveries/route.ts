import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { deliveriesRepository } from '@/lib/repositories/deliveries.repository';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole, DeliveryStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as DeliveryStatus | null;

    const deliveries = await deliveriesRepository.findAll(status || undefined);
    return NextResponse.json({ success: true, data: deliveries });
  } catch (error) {
    console.error('[GET /api/deliveries]', error);
    return NextResponse.json({ success: false, error: 'تعذر جلب طلبات التوصيل' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'deliveries:status:update')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتحديث حالة التوصيل' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, assignedStaffId } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'البيانات غير مكتملة' }, { status: 400 });
    }

    const updated = await deliveriesRepository.updateStatus(id, status, assignedStaffId);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تحديث حالة التوصيل';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
