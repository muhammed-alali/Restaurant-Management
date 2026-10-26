import { NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { ordersService } from '@/lib/services/orders.service';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const orders = await ordersService.getKitchenOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[GET /api/kitchen]', error);
    return NextResponse.json({ success: false, error: 'تعذر جلب طلبات المطبخ' }, { status: 500 });
  }
}
