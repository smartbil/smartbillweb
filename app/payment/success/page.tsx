'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/client/profile');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col bg-background py-8 px-2 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg">Thank you for your payment. Your subscription is now active.</p>
      <button
        type="button"
        className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        onClick={() => router.push('/client/profile')}
      >
        Edit Profile
      </button>
    </div>
  );
}