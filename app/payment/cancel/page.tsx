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
    <div className="flex flex-col bg-background py-8 px-2 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg">Your payment was cancelled. No changes have been made to your subscription.</p>
      <button
        type="button"
        className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        onClick={() => router.push('/client/packages')}
      >
        Back to Packages
      </button>
    </div>
  );
}