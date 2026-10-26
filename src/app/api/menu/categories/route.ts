import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { menuRepository } from '@/lib/repositories/menu.repository';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'menu:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بإضافة تصنيفات' }, { status: 403 });
    }

    const body = await request.json();
    if (!body?.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'اسم التصنيف مطلوب' }, { status: 400 });
    }

    const category = await menuRepository.createCategory(body.name.trim());
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ التصنيف';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
