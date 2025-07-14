import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, checkRateLimit } from '@/app/utils/adminAuth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Type for Firestore timestamp
interface FirestoreTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

// Lazy initialization function
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

export async function GET(req: NextRequest) {
  try {
    // Check rate limit
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`admin-users-${clientIP}`)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Verify admin authentication
    const adminUser = await requireAdminAuth(req);
    console.log(`Admin ${adminUser.email} is fetching users list`);

    // Initialize Firebase Admin
    const adminDb = initializeFirebaseAdmin();

    // Get all users from the users collection
    const usersCollection = adminDb.collection('users');
    const usersSnapshot = await usersCollection.get();
    
    const users = await Promise.all(
      usersSnapshot.docs.map(async (userDoc: { id: string; data: () => Record<string, unknown> }) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        // Get shop data if exists
        let shopData = null;
        try {
          const shopDoc = await adminDb.collection('shops').doc(userId).get();
          if (shopDoc.exists) {
            shopData = shopDoc.data();
          }
        } catch {
          console.log(`No shop data for user ${userId}`);
        }
        
        // Get latest payment
        let latestPayment = null;
        try {
          const paymentsCollection = adminDb.collection('users').doc(userId).collection('payments');
          const paymentsSnapshot = await paymentsCollection.get();
          
          if (!paymentsSnapshot.empty) {
            const payments = paymentsSnapshot.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => ({
              id: doc.id,
              ...doc.data(),
              paidAt: (doc.data().paidAt as FirestoreTimestamp | undefined)?.toDate ? (doc.data().paidAt as FirestoreTimestamp).toDate() : doc.data().paidAt,
              expiresAt: (doc.data().expiresAt as FirestoreTimestamp | undefined)?.toDate ? (doc.data().expiresAt as FirestoreTimestamp).toDate() : doc.data().expiresAt,
            }));
            
            // Sort by paidAt descending to get latest
            payments.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
              const dateA = a.paidAt ? new Date(a.paidAt as string).getTime() : 0;
              const dateB = b.paidAt ? new Date(b.paidAt as string).getTime() : 0;
              return dateB - dateA;
            });
            
            latestPayment = payments[0];
          }
        } catch {
          console.log(`No payment data for user ${userId}`);
        }
        
        return {
          id: userId,
          ...userData,
          createdAt: (userData.createdAt as FirestoreTimestamp | undefined)?.toDate ? (userData.createdAt as FirestoreTimestamp).toDate() : userData.createdAt,
          updatedAt: (userData.updatedAt as FirestoreTimestamp | undefined)?.toDate ? (userData.updatedAt as FirestoreTimestamp).toDate() : userData.updatedAt,
          shopData,
          latestPayment,
        };
      })
    );
    
    // Sort users by creation date (newest first)
    users.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const dateA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Handle authentication errors
    if (error instanceof Error) {
      if (error.message.includes('No authorization') || error.message.includes('Invalid or unauthorized')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized access' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: String(error) },
      { status: 500 }
    );
  }
}
