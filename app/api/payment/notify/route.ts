import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase';
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const merchant_id = formData.get('merchant_id') as string;
  const order_id = formData.get('order_id') as string;
  const payhere_amount = formData.get('payhere_amount') as string;
  const payhere_currency = formData.get('payhere_currency') as string;
  const status_code = formData.get('status_code') as string;
  const md5sig = formData.get('md5sig') as string;
  const subscription_id = formData.get('subscription_id') as string;
  const message_type = formData.get('message_type') as string;
  const item_recurrence = formData.get('item_recurrence') as string;
  const item_duration = formData.get('item_duration') as string;
  const item_rec_status = formData.get('item_rec_status') as string;
  const item_rec_date_next = formData.get('item_rec_date_next') as string;
  const item_rec_install_paid = formData.get('item_rec_install_paid') as string;
  const custom_1 = formData.get('custom_1') as string;

  console.log('PayHere Notify Params:', {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    subscription_id,
    message_type,
    item_recurrence,
    item_duration,
    item_rec_status,
    item_rec_date_next,
    item_rec_install_paid,
    custom_1,
  });
  
  const merchant_secret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;
  const secretMd5 = crypto.createHash('md5').update(merchant_secret!).digest('hex').toUpperCase();
  const localMd5sig = crypto.createHash('md5')
    .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretMd5)
    .digest('hex')
    .toUpperCase();

  if (localMd5sig === md5sig && status_code === '2') {
    // Only update if you have a userId (passed as custom_1)
    if (custom_1) {
      const userRef = doc(db, 'users', custom_1);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const paidAt = new Date();
        const expiresAt = new Date(paidAt);
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        // Add payment record
        const userPaymentsRef = collection(userRef, 'payments');
        const paymentDoc = await addDoc(userPaymentsRef, {
          amount: Number(payhere_amount),
          paidAt,
          expiresAt,
          status: 'success',
          payhereRef: order_id,
        });

        // Update subscription info
        await updateDoc(userRef, {
          subscription: {
            status: 'active',
            expiresAt,
            lastPaymentId: paymentDoc.id,
          }
        });
      }
    }
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}