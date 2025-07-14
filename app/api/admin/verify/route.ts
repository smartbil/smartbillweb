import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, checkRateLimit } from '@/app/utils/adminAuth';

export async function GET(req: NextRequest) {
  try {
    // Check rate limit
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`admin-verify-${clientIP}`)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No authorization token provided', isAdmin: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify admin authentication
    const adminUser = await verifyAdminToken(token);
    
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid or unauthorized token', isAdmin: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin access verified',
      isAdmin: true,
      user: {
        uid: adminUser.uid,
        email: adminUser.email,
        username: adminUser.username
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    const statusCode = errorMessage.includes('No authorization') ? 401 : 
                      errorMessage.includes('Invalid or unauthorized') ? 403 : 500;

    return NextResponse.json(
      { success: false, message: errorMessage, isAdmin: false },
      { status: statusCode }
    );
  }
}
