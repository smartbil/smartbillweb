import type { AdminUser } from './adminUser';
import type { ShopData } from './shopData';
import type { PaymentData } from './paymentData';
import type { UserStats } from './userStats';
import type { FreeTrialData } from './freeTrialData';

export interface UserDetailsResponse {
  success: boolean;
  user: AdminUser;
  shopData: ShopData | null;
  payments: PaymentData[];
  freeTrials: FreeTrialData[];
  stats: UserStats;
  message?: string;
}
