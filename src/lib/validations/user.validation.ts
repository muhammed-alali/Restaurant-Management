import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'STAFF', 'CHEF', 'DELIVERY_STAFF']);

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل')
    .max(50, 'الاسم طويل جداً'),
  username: z
    .string()
    .min(3, 'اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل')
    .max(20, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطة سفلية فقط'),
  password: z
    .string()
    .min(4, 'كلمة المرور يجب أن تحتوي على 4 أحرف على الأقل')
    .max(50, 'كلمة المرور طويلة جداً'),
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل')
    .max(50, 'الاسم طويل جداً')
    .optional(),
  username: z
    .string()
    .min(3, 'اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل')
    .max(20, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطة سفلية فقط')
    .optional(),
  password: z
    .string()
    .min(4, 'كلمة المرور يجب أن تحتوي على 4 أحرف على الأقل')
    .max(50, 'كلمة المرور طويلة جداً')
    .optional(),
  role: userRoleSchema.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
