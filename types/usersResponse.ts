import type { AdminUser } from './adminUser';

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  total: number;
  message?: string;
}
