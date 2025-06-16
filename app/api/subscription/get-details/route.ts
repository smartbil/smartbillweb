import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        const subscriptionRef = doc(db, 'subscriptions', userId);
        const subscriptionDoc = await getDoc(subscriptionRef);

        if (!subscriptionDoc.exists()) {
            return NextResponse.json(
                { success: false, message: 'No subscription found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                subscription: {
                    id: subscriptionDoc.id,
                    ...subscriptionDoc.data()
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch subscription details' },
            { status: 500 }
        );
    }
}