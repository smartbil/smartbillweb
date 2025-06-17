interface PayhereParams {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  recurrence: string;
  duration: string;
  hash:  string;
  startup_fee: string;
  custom_1: string | null;
}
