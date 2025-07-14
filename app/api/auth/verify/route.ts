import { NextRequest, NextResponse } from 'next/server';
import { verifyClientToken, updateUserLastActivity, checkClientRateLimit } from '@/app/utils/clientAuth';

export async function GET(req: NextRequest) {
  try {
    // Check rate limit
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkClientRateLimit(`client-verify-${clientIP}`)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify user authentication
    const clientUser = await verifyClientToken(token);
    
    if (!clientUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!clientUser.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is suspended or inactive' },
        { status: 403 }
      );
    }

    // Update user's last activity
    await updateUserLastActivity(clientUser.uid);

    return NextResponse.json({
      success: true,
      message: 'User session verified',
      user: {
        uid: clientUser.uid,
        email: clientUser.email,
        username: clientUser.username,
        subscriptionStatus: clientUser.subscriptionStatus,
        shopId: clientUser.shopId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('User verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    let statusCode = 500;
    
    if (errorMessage.includes('No authorization')) {
      statusCode = 401;
    } else if (errorMessage.includes('suspended') || errorMessage.includes('not active')) {
      statusCode = 403;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
