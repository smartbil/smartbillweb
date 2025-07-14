export interface SubscriptionData {
  status: 'active' | 'canceled' | 'expired' | string;
  nextBillingDate?: string;
  recurrence?: string;
  plan?: string;
  amount?: string;
  currency?: string;
  expiresAt?: Date | string;
}
