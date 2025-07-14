export interface PaymentData {
  id: string;
  amount: string | number;
  paidAt: Date | string;
  expiresAt: Date | string;
  status: string;
  method?: string;
  packageName: string;
  payhereRef?: string;
  payment_id: string;
}
