import type { PaymentData } from './paymentData';

export interface FreeTrialData extends PaymentData {
  paymentType: 'free_trial';
  duration: number;
  notes: string;
  createdBy: string;
}
