// This file now re-exports all admin-related types from their separate files
// for backward compatibility

export type { AdminUser } from './adminUser';
export type { ExtendedAdminUser } from './extendedAdminUser';
export type { ShopData } from './shopData';
export type { PaymentData } from './paymentData';
export type { FreeTrialData } from './freeTrialData';
export type { UserStats } from './userStats';
export type { UsersResponse } from './usersResponse';
export type { SubscriptionData } from './subscriptionData';
export type { AdminPackage as Package } from './adminPackage'; // Keep the original name for backward compatibility
export type { ManualPaymentRequest } from './manualPaymentRequest';

// Import types for local use
import type { AdminUser } from './adminUser';
import type { ShopData } from './shopData';
import type { PaymentData } from './paymentData';
import type { FreeTrialData } from './freeTrialData';
import type { UserStats } from './userStats';

// Temporarily inline UserDetailsResponse until module resolution is fixed
export interface UserDetailsResponse {
  success: boolean;
  user: AdminUser;
  shopData: ShopData | null;
  payments: PaymentData[];
  freeTrials: FreeTrialData[];
  stats: UserStats;
  message?: string;
}
