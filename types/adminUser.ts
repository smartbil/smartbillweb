export interface AdminUser {
  id: string;
  uid?: string;
  email?: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isAdmin?: boolean;
}
