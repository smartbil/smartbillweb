import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const merchant_id = formData.get('merchant_id') as string;
  const order_id = formData.get('order_id') as string;
  const payment_id = formData.get('payment_id') as string;
  const payhere_amount = formData.get('payhere_amount') as string;
  const payhere_currency = formData.get('payhere_currency') as string;
  const status_code = formData.get('status_code') as string;
  const md5sig = formData.get('md5sig') as string;
  const custom_1 = formData.get('custom_1') as string;
  const method = formData.get('method') as string;
  const status_message = formData.get('status_message') as string;

  console.log('PayHere Notify Params:', {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    custom_1,
    method,
    status_message,
  });

  function getPackageByAmount(amount: string | number): string | null {
    const amountNum = Number(amount);
    switch (amountNum) {
      case 100:
        return 'Starter Plan';
      case 1990:
        return 'Standard Plan';
      case 3990:
        return 'Business Plan';
      default:
        return null;
    }
  }

  const merchant_secret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;
  if (!merchant_secret) {
    return NextResponse.json({ success: false, message: 'Merchant secret not set' }, { status: 500 });
  }

  // Compute local MD5 signature based on PayHere documentation
  const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
  const localMd5sig = crypto.createHash('md5')
    .update(
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      hashedSecret
    )
    .digest('hex')
    .toUpperCase();

  // Proceed only if checksum matches and status is success
  if (localMd5sig === md5sig && status_code === '2') {
    if (custom_1) {
      const userRef = doc(db, 'users', custom_1);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const paidAt = new Date();
        const expiresAt = new Date(paidAt);
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        const packageName = getPackageByAmount(payhere_amount);

        // Record payment under user's payment history
        const userPaymentsRef = collection(userRef, 'payments');
        const paymentDoc = await addDoc(userPaymentsRef, {
          amount: Number(payhere_amount),
          paidAt,
          expiresAt,
          status: 'success',
          method,
          packageName,
          payhereRef: order_id,
          payment_id,
        });

        // Update user subscription
        await updateDoc(userRef, {
          subscription: {
            status: 'active',
            packageName,
            expiresAt,
            lastPaymentId: paymentDoc.id,
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } else {
    console.warn('Invalid payment or checksum verification failed.');
    return NextResponse.json({ success: false, message: 'Invalid signature or unsuccessful payment' }, { status: 400 });
  }
}