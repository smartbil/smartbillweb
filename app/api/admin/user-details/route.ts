import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Type for Firestore timestamp
interface FirestoreTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
  }

  try {
    // Get user data
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // Get shop data
    let shopData = null;
    try {
      const shopDoc = await adminDb.collection('shops').doc(userId).get();
      if (shopDoc.exists) {
        shopData = shopDoc.data();
      }
    } catch {
      console.log(`No shop data for user ${userId}`);
    }

    // Get all payments and separate free trials
    const payments: Array<Record<string, unknown>> = [];
    const freeTrials: Array<Record<string, unknown>> = [];
    try {
      const paymentsCollection = adminDb.collection('users').doc(userId).collection('payments');
      const paymentsSnapshot = await paymentsCollection.get();
      
      paymentsSnapshot.docs.forEach((doc: { id: string; data: () => Record<string, unknown> }) => {
        const paymentData = doc.data();
        const processedPayment = {
          id: doc.id,
          ...paymentData,
          paidAt: (paymentData.paidAt as FirestoreTimestamp | undefined)?.toDate ? (paymentData.paidAt as FirestoreTimestamp).toDate() : paymentData.paidAt,
          expiresAt: (paymentData.expiresAt as FirestoreTimestamp | undefined)?.toDate ? (paymentData.expiresAt as FirestoreTimestamp).toDate() : paymentData.expiresAt,
        };

        // Separate free trials from regular payments
        if (paymentData.paymentType === 'free_trial' || paymentData.payment_id === 'free_trial') {
          freeTrials.push(processedPayment);
        } else {
          payments.push(processedPayment);
        }
      });

      // Sort both arrays by paidAt descending
      payments.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const dateA = a.paidAt ? new Date(a.paidAt as string).getTime() : 0;
        const dateB = b.paidAt ? new Date(b.paidAt as string).getTime() : 0;
        return dateB - dateA;
      });

      freeTrials.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const dateA = a.paidAt ? new Date(a.paidAt as string).getTime() : 0;
        const dateB = b.paidAt ? new Date(b.paidAt as string).getTime() : 0;
        return dateB - dateA;
      });
    } catch {
      console.log(`No payment data for user ${userId}`);
    }

    // Get user stats
    const stats = {
      totalCategories: 0,
      totalProducts: 0,
      totalCustomers: 0,
      totalSales: 0,
      totalSalesAmount: 0
    };

    try {
      // Get categories count
      const categoriesSnapshot = await adminDb.collection('shops').doc(userId).collection('categories').get();
      stats.totalCategories = categoriesSnapshot.size;

      // Get products count
      const productsSnapshot = await adminDb.collection('shops').doc(userId).collection('products').get();
      stats.totalProducts = productsSnapshot.size;

      // Get customers count
      const customersSnapshot = await adminDb.collection('shops').doc(userId).collection('customers').get();
      stats.totalCustomers = customersSnapshot.size;

      // Get sales count and amount
      const salesSnapshot = await adminDb.collection('shops').doc(userId).collection('sales').get();
      stats.totalSales = salesSnapshot.size;
      
      let totalAmount = 0;
      salesSnapshot.docs.forEach((doc: { data: () => Record<string, unknown> }) => {
        const saleData = doc.data();
        totalAmount += (saleData.totalAmount as number) || 0;
      });
      stats.totalSalesAmount = totalAmount;
    } catch (error) {
      console.log(`Error getting stats for user ${userId}:`, error);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        ...userData,
        createdAt: userData?.createdAt?.toDate ? userData.createdAt.toDate() : userData?.createdAt,
        updatedAt: userData?.updatedAt?.toDate ? userData.updatedAt.toDate() : userData?.updatedAt,
      },
      shopData,
      payments,
      freeTrials,
      stats
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user details', error: String(error) },
      { status: 500 }
    );
  }
}
