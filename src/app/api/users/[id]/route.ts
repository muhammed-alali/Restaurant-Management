import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { usersService } from '@/lib/services/users.service';
import { updateUserSchema } from '@/lib/validations/user.validation';
import { hasPermission } from '@/lib/auth/permissions';
import type { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'users:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتحديث المستخدم' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const user = await usersService.updateUser(id, parsed.data);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تحديث المستخدم';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const currentUserId = (session.user as { id: string }).id;
    const role = (session.user as { role: UserRole }).role;
    if (!hasPermission(role, 'users:manage')) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بحذف المستخدم' }, { status: 403 });
    }

    const { id } = await params;
    await usersService.deleteUser(id, currentUserId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حذف المستخدم';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
