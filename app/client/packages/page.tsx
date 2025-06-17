'use client';

import { useAuthStore } from '@/app/store/authStore';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const PAYHERE_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1230646';
const PAYHERE_SANDBOX_URL = process.env.NEXT_PUBLIC_PAYHERE_CHECKOUT_URL;

const packages: Package[] = [
  {
    title: 'Starter Plan',
    price: 'LKR 990/month',
    description: 'Ideal for small businesses and startups',
    features: [
      '1 User Account',
      'Mobile POS Access',
      'Sales & Invoice Management',
      'Basic Inventory Tracking',
      'Daily Backup',
      'Email Support',
    ],
    borderColor: 'border-smartbill-green',
    highlightText: '✅ Best for: Micro businesses, kiosks, food stalls',
    bestFor: 'text-smartbill-green',
    buttonColor: 'bg-smartbill-green',
  },
  {
    title: 'Standard Plan',
    price: 'LKR 1,990/month',
    description: 'Perfect for retail shops and service providers',
    features: [
      'Everything in Starter, plus:',
      '3 User Accounts',
      'Web POS Access',
      'Customer Management',
      'Sales & Expense Reports',
      'Discount & Return Handling',
      'Priority Support',
    ],
    borderColor: 'border-smartbill-blue',
    highlightText: '✅ Best for: Retail stores, salons, cafes',
    bestFor: 'text-smartbill-blue',
    buttonColor: 'bg-smartbill-blue',
  },
  {
    title: 'Business Plan',
    price: 'LKR 3,990/month',
    description: 'For growing businesses with more advanced needs',
    features: [
      'Everything in Standard, plus:',
      '5 User Accounts',
      'Multi-Device Sync',
      'Purchase Order Management',
      'Barcode Scanner Integration',
      'Product Variant Support',
    ],
    borderColor: 'border-smartbill-purple',
    highlightText: '✅ Best for: Boutiques, franchises, services',
    bestFor: 'text-smartbill-purple',
    buttonColor: 'bg-smartbill-purple',
  },
  {
    title: 'Enterprise Plan',
    price: 'Custom Pricing',
    description: 'Tailored solutions for large enterprises',
    features: [
      'Everything in Business, plus:',
      'Unlimited User Accounts',
      'Custom Integrations',
      'Dedicated Account Manager',
      'Priority Onboarding & Training',
      'Premium Support',
    ],
    borderColor: 'border-smartbill-yellow',
    highlightText: '✅ Best for: Large chains, enterprises',
    bestFor: 'text-smartbill-yellow',
    buttonColor: 'bg-smartbill-yellow',
  },
];

const PackagesDisplay: React.FC = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  const [payhereFormData, setPayhereFormData] = useState<PayhereParams | null>(null);

  const user = useAuthStore((state) => state.user) as UserData | null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src*="payhere"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.payhere.lk/lib/payhere.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
    return () => {
      const script = document.querySelector('script[src*="payhere"]');
      if (script) document.body.removeChild(script);
    };
  }, []);

  const handleGetStarted = (pkg: Package) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Sign In Required',
        text: 'You must be signed in to subscribe to a package.',
      });
      return;
    }
    if (pkg.title === 'Enterprise Plan') {
      Swal.fire({
        icon: 'info',
        title: 'Contact Sales',
        text: 'Please contact our sales team for Enterprise Plan pricing and setup.',
      });
      return;
    }
    setSelectedPackage(pkg);
    setShowPaymentForm(true);
  };

  const handlePayment = async () => {
    if (!user) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sign In Required',
        text: 'You must be signed in to subscribe to a package.',
      });
      setShowPaymentForm(false);
      return;
    }
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (!selectedPackage) return;

    const orderId = `SUB-${Date.now()}`;
    const amount = selectedPackage.price.replace(/[^0-9.]/g, '');
    const currency = 'LKR';

    const hashRes = await fetch('/api/payhere/generate-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: PAYHERE_MERCHANT_ID,
        order_id: orderId,
        amount,
        currency,
      }),
    });

    const hashData = await hashRes.json();

    if (!hashData.success) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'Failed to generate payment hash',
      });
      return;
    }

    setPayhereFormData({
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      notify_url: `${window.location.origin}/api/payment/notify`,
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      country: 'Sri Lanka',
      order_id: orderId,
      items: selectedPackage.title,
      currency,
      amount,
      hash: hashData.hash,
      custom_1: user?.uid ?? null,
    });
  };

  useEffect(() => {
    if (payhereFormData) {
      const form = document.getElementById('payhere-form') as HTMLFormElement | null;
      if (form) {
        form.submit();
      }
      setPayhereFormData(null);
    }
  }, [payhereFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div suppressHydrationWarning className="font-inter bg-smartbill-dark-blue text-black min-h-screen">
        {/* Payment Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Subscribe to {selectedPackage?.title}</h3>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">{selectedPackage?.title}</p>
                <p className="text-lg text-primary">{selectedPackage?.price}</p>
              </div>
              <div className="space-y-4">
                {['firstName', 'lastName', 'email', 'phone', 'address', 'city'].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)} {['firstName', 'lastName', 'email', 'phone'].includes(field) ? '*' : ''}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={customerInfo[field as keyof CustomerInfo]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <section className="flex flex-col justify-between px-4 py-8 sm:py-12">
          <div className="container mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">SmartBill Pricing Plans</h1>
            <p className="text-lg sm:text-xl text-smartbill-light-blue max-w-3xl mx-auto">
              Flexible and Transparent Pricing to Suit Every Business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-accent bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col hover:scale-105 border-t-4`}
              >
                <h2 className={`text-2xl font-semibold mb-2 ${pkg.bestFor}`}>{pkg.title}</h2>
                <p className="text-2xl font-bold mb-4 text-primary">{pkg.price}</p>
                <p className="text-smartbill-light-blue mb-6">{pkg.description}</p>
                <ul className="text-black text-base space-y-3 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className={`${pkg.bestFor} mr-2`}>✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-smartbill-light-blue border-opacity-30">
                  <p className="text-primary text-lg mb-4">{pkg.highlightText}</p>
                  <button
                    onClick={() => handleGetStarted(pkg)}
                    className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-secondary hover:bg-opacity-90 shadow-md"
                  >
                    {pkg.title === 'Enterprise Plan' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hidden PayHere form */}
        <form id="payhere-form" method="POST" action={PAYHERE_SANDBOX_URL ?? ''} style={{ display: 'none' }}>
          {payhereFormData &&
            Object.entries(payhereFormData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={String(value)} />
            ))}
        </form>
      </div>
    </>
  );
};

export default PackagesDisplay;
