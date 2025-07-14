import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
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

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      packageName, 
      packageType, 
      duration, 
      amount = 0, 
      paymentType = 'free_trial',
      notes 
    } = await req.json();

    if (!userId || !packageName || !duration) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: userId, packageName, duration' 
      }, { status: 400 });
    }

    // Check if user exists
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (duration * 24 * 60 * 60 * 1000));

    // Create payment record
    const paymentData = {
      amount: amount.toString(),
      packageName,
      packageType: packageType || 'custom',
      paidAt: now,
      expiresAt,
      status: 'success',
      method: 'manual',
      payment_id: null,
      payhereRef: null, // No payment gateway reference for manual payments
      paymentType, // 'manual' or 'free_trial'
      duration, // days
      notes: notes || '',
      createdBy: 'admin',
      createdAt: now
    };

    // Add to payments subcollection
    const paymentRef = await adminDb
      .collection('users')
      .doc(userId)
      .collection('payments')
      .add(paymentData);

    // Update user subscription status
    const subscriptionData = {
      status: 'active',
      packageName: packageName,
      expiresAt,
      lastPaymentType: paymentType
    };

    await adminDb.collection('users').doc(userId).update({
      subscription: subscriptionData,
      updatedAt: now
    });

    return NextResponse.json({
      success: true,
      message: paymentType === 'free_trial' ? 'Free trial added successfully' : 'Manual payment added successfully',
      paymentId: paymentRef.id,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error adding manual payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add payment', error: String(error) },
      { status: 500 }
    );
  }
}
