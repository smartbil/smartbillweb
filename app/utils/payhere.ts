export const initiatePayhereSubscription = (packageDetails: any, customerInfo: any) => {
  // Create PayHere payment window
  const payhere = (window as any).payhere;

  // Payment parameters
  const payment: PayhereParams = {
    merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    notify_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payment/notify`,
    first_name: customerInfo.firstName,
    last_name: customerInfo.lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address,
    city: customerInfo.city,
    country: "Sri Lanka",
    order_id: `SUB-${Date.now()}`,
    items: packageDetails.title,
    currency: "LKR",
    amount: packageDetails.price.replace(/[^0-9]/g, ''),
    recurrence: "1 Month", 
    duration: "Forever",
    startup_fee: "0"
  };

  payhere.startPayment(payment);
};