import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string().min(2, 'اسم الأكلة مطلوب').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر').max(10000),
  image: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  categoryId: z.string().min(1, 'التصنيف مطلوب'),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(2, 'اسم التصنيف مطلوب').max(50),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
