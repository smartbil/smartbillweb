import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const {
            userId,
            subscriptionData,
            orderId,
            packageDetails,
            status = 'active'
        } = await req.json();

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
        const { userId, status } = await req.json();

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