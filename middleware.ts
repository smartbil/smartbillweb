import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to sign-in page
    if (request.nextUrl.pathname === '/admin/sign-in') {
      return NextResponse.next();
    }

    // Get auth token from cookies
    const authCookie = request.cookies.get('admin-auth-token');
    
    if (!authCookie?.value) {
      console.log('No admin auth token found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/admin/sign-in', request.url));
    }

    // For Edge Runtime, we'll validate the token on the client side
    // The actual admin verification will happen in the layout component
    const response = NextResponse.next();
    response.headers.set('x-admin-token', authCookie.value);
    return response;
  }

  // Check if the request is for protected client routes
  if (request.nextUrl.pathname.startsWith('/client')) {
    // Allow access to auth pages (sign-in, sign-up)
    if (request.nextUrl.pathname.startsWith('/client/(auth)') || 
        request.nextUrl.pathname.includes('/sign-in') || 
        request.nextUrl.pathname.includes('/sign-up')) {
      return NextResponse.next();
    }

    // Allow access to public pages
    const publicClientPages = [
      '/client',
      '/client/',
      '/client/home',
      '/client/privacy-policy',
      '/client/guide'
    ];
    if (
      publicClientPages.some(page => request.nextUrl.pathname === page || request.nextUrl.pathname.startsWith(page + '/'))
    ) {
      return NextResponse.next();
    }

    // Get client auth token from cookies
    const clientAuthCookie = request.cookies.get('client-auth-token');
    
    if (!clientAuthCookie?.value) {
      console.log('No client auth token found, redirecting to sign-in');
      return NextResponse.redirect(new URL('/client/sign-in', request.url));
    }

    // For Edge Runtime, we'll validate the token on the client side
    const response = NextResponse.next();
    response.headers.set('x-client-token', clientAuthCookie.value);
    return response;
  }

  // Check if the request is for admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // The actual token verification will happen in each API route
    // since Firebase Admin SDK can't run in Edge Runtime
    return NextResponse.next();
  }

  // Check if the request is for protected client API routes
  if (request.nextUrl.pathname.startsWith('/api/') && 
      !request.nextUrl.pathname.startsWith('/api/auth/') &&
      !request.nextUrl.pathname.startsWith('/api/admin/')) {
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // The actual token verification will happen in each API route
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/client/:path*',
    '/api/:path*'
  ]
};
