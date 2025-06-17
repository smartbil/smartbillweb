'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/client/packages');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col gap-4 bg-white py-8 px-2 items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-2xl text-black">Your payment was cancelled. No changes have been made to your subscription.</p>
    </div>
  );
}