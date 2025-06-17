import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', userId);
    const paymentsCol = collection(userRef, 'payments');
    const snapshot = await getDocs(paymentsCol);

    const payments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount,
        paidAt: data.paidAt?.toDate ? data.paidAt.toDate() : data.paidAt,
        expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : data.expiresAt,
        status: data.status,
        method: data.method,
        packageName: data.packageName,
        payhereRef: data.payhereRef,
        payment_id: data.payment_id,
      };
    });

    // Sort by paidAt descending
    payments.sort((a, b) => (b.paidAt && a.paidAt ? new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime() : 0));

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch payment history', error: String(error) }, { status: 500 });
  }
}