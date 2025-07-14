import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    try {
        // Check rate limit
        const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkClientRateLimit(`subscription-details-${clientIP}`)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify client authentication
        const clientUser = await requireClientAuth(req);

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Verify user can only access their own subscription
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
            { success: false, message: 'Failed to fetch subscription details' },
            { status: 500 }
        );
    }
}