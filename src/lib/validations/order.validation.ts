import { z } from 'zod';

export const createOrderItemSchema = z.object({
  menuItemId: z.string().min(1, 'معرّف الصنف مطلوب'),
  quantity: z.number().int().min(1, 'الكمية يجب أن تكون 1 على الأقل').max(50),
  notes: z.string().max(200).optional(),
});

export const createOrderSchema = z.object({
  type: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY'], {
    errorMap: () => ({ message: 'نوع الطلب غير صحيح' }),
  }),
  tableId: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(createOrderItemSchema)
    .min(1, 'أضف صنفاً واحداً على الأقل إلى الطلب'),
  delivery: z
    .object({
      recipientName: z.string().min(1, 'اسم المستلم مطلوب').max(100),
      phone: z.string().min(5, 'رقم الجوال مطلوب').max(20),
      address: z.string().min(3, 'العنوان مطلوب').max(500),
      bikeNumber: z.number().int().optional(),
    })
    .optional(),
}).refine(
  (data) => {
    if (data.type === 'DINE_IN' && !data.tableId) {
      return false;
    }
    return true;
  },
  { message: 'رقم الطاولة مطلوب للطلبات الداخلية', path: ['tableId'] },
).refine(
  (data) => {
    if (data.type === 'DELIVERY' && !data.delivery) {
      return false;
    }
    return true;
  },
  { message: 'بيانات التوصيل مطلوبة', path: ['delivery'] },
);

export const updateOrderStatusSchema = z.object({
  status: z.enum(['NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'حالة الطلب غير صحيحة' }),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
