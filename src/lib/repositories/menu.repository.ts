import { prisma } from '@/lib/db/prisma';
import type { MenuItem, MenuCategory } from '@/types';

function mapMenuItem(row: {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; createdAt: Date };
}): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    isAvailable: row.isAvailable,
    categoryId: row.categoryId,
    category: row.category,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const menuRepository = {
  async findAllItems(filters?: { categoryId?: string; isAvailable?: boolean }): Promise<MenuItem[]> {
    const rows = await prisma.menuItem.findMany({
      where: {
        ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters?.isAvailable !== undefined ? { isAvailable: filters.isAvailable } : {}),
      },
      include: { category: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });
    return rows.map(mapMenuItem);
  },

  async findItemById(id: string): Promise<MenuItem | null> {
    const row = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    return row ? mapMenuItem(row) : null;
  },

  async createItem(data: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable?: boolean;
    categoryId: string;
  }): Promise<MenuItem> {
    const row = await prisma.menuItem.create({
      data: {
        ...data,
        isAvailable: data.isAvailable ?? true,
      },
      include: { category: true },
    });
    return mapMenuItem(row);
  },

  async updateItem(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    categoryId: string;
  }>): Promise<MenuItem> {
    const row = await prisma.menuItem.update({
      where: { id },
      data,
      include: { category: true },
    });
    return mapMenuItem(row);
  },

  async findAllCategories(): Promise<MenuCategory[]> {
    return prisma.menuCategory.findMany({ orderBy: { name: 'asc' } });
  },

  async createCategory(name: string): Promise<MenuCategory> {
    return prisma.menuCategory.create({ data: { name } });
  },
};
