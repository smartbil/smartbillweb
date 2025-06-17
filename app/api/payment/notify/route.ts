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

  if (localMd5sig === md5sig) {
    // Only update if you have a userId (passed as custom_1)
    if (custom_1) {
      const userRef = doc(db, 'users', custom_1);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          subscription: {
            subscriptionId: subscription_id,
            orderId: order_id,
            amount: payhere_amount,
            currency: payhere_currency,
            status: status_code === '2' && item_rec_status === '0' ? 'active'
                   : item_rec_status === '-1' ? 'canceled'
                   : 'inactive',
            messageType: message_type,
            recurrence: item_recurrence,
            duration: item_duration,
            recStatus: item_rec_status,
            nextBillingDate: item_rec_date_next,
            paidInstallments: item_rec_install_paid,
            lastUpdated: new Date(),
          }
        });

        // Track payment in user's payments subcollection
        const userPaymentsRef = collection(userRef, 'payments');
        await addDoc(userPaymentsRef, {
          subscriptionId: subscription_id,
          orderId: order_id,
          amount: payhere_amount,
          currency: payhere_currency,
          statusCode: status_code,
          messageType: message_type,
          recurrence: item_recurrence,
          duration: item_duration,
          recStatus: item_rec_status,
          nextBillingDate: item_rec_date_next,
          paidInstallments: item_rec_install_paid,
          timestamp: new Date(),
        });
      }
    }
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}