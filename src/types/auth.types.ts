export type UserRole = 'ADMIN' | 'STAFF' | 'CHEF' | 'DELIVERY_STAFF';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
