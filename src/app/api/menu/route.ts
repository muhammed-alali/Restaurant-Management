import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { menuRepository } from '@/lib/repositories/menu.repository';
import { createMenuItemSchema, updateMenuItemSchema } from '@/lib/validations/menu.validation';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isAvailableParam = searchParams.get('isAvailable');
    const isAvailable = isAvailableParam !== null ? isAvailableParam === 'true' : undefined;

    const [items, categories] = await Promise.all([
      menuRepository.findAllItems({ categoryId, isAvailable }),
      menuRepository.findAllCategories(),
    ]);

    return NextResponse.json({ success: true, data: { items, categories } });
  } catch (error) {
    console.error('[GET /api/menu]', error);
    return NextResponse.json({ success: false, error: 'تعذر جلب قائمة الطعام' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'menu:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتعديل المنيو' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createMenuItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const item = await menuRepository.createItem(parsed.data);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ الصنف';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'menu:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتعديل المنيو' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف الصنف مطلوب' }, { status: 400 });
    }

    const parsed = updateMenuItemSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const updated = await menuRepository.updateItem(id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تعديل الصنف';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
