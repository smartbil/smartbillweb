import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Check rate limit - stricter for payment operations
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkClientRateLimit(`payhere-hash-${clientIP}`)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Verify client authentication
    await requireClientAuth(req);

    const { merchant_id, order_id, amount, currency } = await req.json();
    const merchant_secret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

    if (!merchant_id || !order_id || !amount || !currency || !merchant_secret) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const formattedAmount = Number(amount).toFixed(2);
    const secretMd5 = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + formattedAmount + currency + secretMd5;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return NextResponse.json({ success: true, hash });
  } catch (error) {
    console.error('Error generating hash:', error);
    
    // Handle authentication errors
    if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }
    }
    
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}