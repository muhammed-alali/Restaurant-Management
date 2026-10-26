import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { tablesRepository } from '@/lib/repositories/tables.repository';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole, TableStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const tables = await tablesRepository.findAll();
    return NextResponse.json({ success: true, data: tables });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'تعذر جلب الطاولات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'tables:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بإضافة طاولات' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.number || !body.capacity) {
      return NextResponse.json({ success: false, error: 'رقم الطاولة والسعة مطلوبان' }, { status: 400 });
    }

    const table = await tablesRepository.create({
      number: Number(body.number),
      capacity: Number(body.capacity),
    });

    return NextResponse.json({ success: true, data: table }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر إضافة الطاولة';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
