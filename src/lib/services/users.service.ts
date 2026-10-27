import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';
import type { User, UserRole } from '@/types';

export interface SafeUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  name: user.name,
  username: user.username,
  role: user.role as UserRole,
  createdAt: user.createdAt,
});

export const usersService = {
  async getAllUsers(): Promise<SafeUser[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map((user) => toSafeUser(user as User));
  },

  async createUser(data: {
    name: string;
    username: string;
    password: string;
    role: UserRole;
  }): Promise<SafeUser> {
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw new Error('اسم المستخدم موجود بالفعل');
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: hashedPassword,
        role: data.role,
      },
    });

    return toSafeUser(user as User);
  },

  async updateUser(
    id: string,
    data: Partial<{
      name: string;
      username: string;
      password: string;
      role: UserRole;
    }>,
  ): Promise<SafeUser> {
    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id },
        },
      });

      if (existing) {
        throw new Error('اسم المستخدم موجود بالفعل');
      }
    }

    let password: string | undefined;

    if (data.password) {
      password = await hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.username !== undefined && { username: data.username }),
        ...(password !== undefined && { password }),
        ...(data.role !== undefined && { role: data.role }),
      },
    });

    return toSafeUser(user as User);
  },

  async deleteUser(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new Error('لا يمكنك حذف حسابك الخاص');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    await prisma.user.delete({
      where: { id },
    });
  },
};
