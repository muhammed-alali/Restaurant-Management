export interface MenuCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  isAvailable: boolean;
  categoryId: string;
  category?: MenuCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemPayload {
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  categoryId: string;
}

export interface UpdateMenuItemPayload extends Partial<CreateMenuItemPayload> {}

export interface CreateCategoryPayload {
  name: string;
}
