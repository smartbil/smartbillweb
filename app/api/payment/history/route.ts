import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import { db } from '@/firebase';
import { doc, collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    // Check rate limit
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkClientRateLimit(`payment-history-${clientIP}`)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Verify client authentication
    const clientUser = await requireClientAuth(req);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Verify user can only access their own payment history
    if (userId !== clientUser.uid) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

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
    console.error('Error fetching payment history:', error);
    
    // Handle authentication errors
    if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment history' }, 
      { status: 500 }
    );
  }
}