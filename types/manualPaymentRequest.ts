export interface ManualPaymentRequest {
  userId: string;
  packageName: string;
  packageType?: string;
  duration: number; // days
  amount?: number;
  paymentType: 'manual' | 'free_trial';
  notes?: string;
}
