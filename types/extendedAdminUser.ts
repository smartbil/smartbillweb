import { AdminUser } from './adminUser';
import { PaymentData } from './paymentData';
import { SubscriptionData } from './subscriptionData';

export interface ExtendedAdminUser extends AdminUser {
  shopName?: string;
  businessType?: string;
  subscription?: SubscriptionData;
  latestPayment?: PaymentData;
  shopData?: {
    shopName?: string;
    businessType?: string;
    [key: string]: any;
  };
}
