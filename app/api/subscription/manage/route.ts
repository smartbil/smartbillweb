import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import { db } from '@/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkClientRateLimit(`subscription-manage-${clientIP}`)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify client authentication
        const clientUser = await requireClientAuth(req);

        const {
            userId,
            subscriptionData,
            orderId,
            packageDetails,
            status = 'active'
        } = await req.json();

        // Verify user can only manage their own subscription
        if (userId !== clientUser.uid) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        if (!userId || !subscriptionData || !orderId || !packageDetails) {
            return NextResponse.json(
                { success: false, message: 'Required fields missing' },
                { status: 400 }
            );
        }

        const subscriptionRef = doc(db, 'subscriptions', userId);
        await setDoc(subscriptionRef, {
            userId,
            orderId,
            packageTitle: packageDetails.title,
            packagePrice: packageDetails.price,
            status,
            startDate: serverTimestamp(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            paymentHistory: [{
                date: new Date(),
                amount: packageDetails.price.replace(/[^0-9]/g, ''),
                status: 'success'
            }],
            payhere: subscriptionData
        });

        return NextResponse.json(
            { success: true, message: 'Subscription created successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Subscription creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create subscription' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Check rate limit
        const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkClientRateLimit(`subscription-update-${clientIP}`)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify client authentication
        const clientUser = await requireClientAuth(req);

        const { userId, status } = await req.json();

        // Verify user can only manage their own subscription
        if (userId !== clientUser.uid) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        const subscriptionRef = doc(db, 'subscriptions', userId);
        await updateDoc(subscriptionRef, {
            status,
            canceledAt: status === 'canceled' ? serverTimestamp() : null
        });

        return NextResponse.json(
            { success: true, message: 'Subscription updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Subscription update error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update subscription' },
            { status: 500 }
        );
    }
}