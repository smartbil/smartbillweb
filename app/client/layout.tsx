'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/app/hooks/useClientAuth';
import Header from '../components/client/header';
import Swal from 'sweetalert2';

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    
    // Helper function to check if current path is public
    const isPublicPath = () => {
        if (typeof window === 'undefined') return false;
        
        const currentPath = window.location.pathname;
        return (
            currentPath === '/client' ||
            currentPath === '/client/' ||
            currentPath.startsWith('/client/home') ||
            currentPath.startsWith('/client/sign-in') ||
            currentPath.startsWith('/client/sign-up') ||
            currentPath.startsWith('/client/privacy-policy') ||
            currentPath.startsWith('/client/guide')
        );
    };

    const [isPublic] = useState(isPublicPath());
    
    // Use the auth hook - only require auth for non-public pages
    const { 
        isAuthenticated, 
        user, 
        logout, 
        updateLastActivity, 
        checkSessionExpiry, 
        setSessionValid,
        hasHydrated
    } = useClientAuth({ 
        requireAuth: !isPublic
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        // Don't run verification until hydration is complete
        if (!hasHydrated) return;
        
        const verifyClientAccess = async () => {
            try {
                setIsVerifying(true);
                
                // For public pages, skip all authentication verification
                if (isPublic) {
                    console.log('Public page detected, skipping all auth verification');
                    setIsLoading(false);
                    setIsVerifying(false);
                    return;
                }

                // Protected page logic
                console.log('Protected page detected, verifying authentication');
                
                // Check if session has expired
                if (!checkSessionExpiry()) {
                    console.log('Session expired, redirecting to sign-in');
                    router.push('/client/sign-in?error=session-expired');
                    return;
                }

                // Check if user is authenticated
                if (!isAuthenticated || !user?.token) {
                    console.log('No authentication found, redirecting to sign-in');
                    router.push('/client/sign-in');
                    return;
                }

                // Verify user session with backend
                const response = await fetch('/api/auth/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.log('User verification failed:', response.status);
                    
                    if (response.status === 401) {
                        await Swal.fire({
                            icon: 'warning',
                            title: 'Session Expired',
                            text: 'Your session has expired. Please sign in again.',
                            confirmButtonText: 'Sign In'
                        });
                    } else if (response.status === 403) {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Account Suspended',
                            text: 'Your account has been suspended. Please contact support.',
                            confirmButtonText: 'OK'
                        });
                    }
                    
                    await logout();
                    router.push('/client/sign-in?error=verification-failed');
                    return;
                }

                const data = await response.json();
                
                if (!data.success || !data.user) {
                    console.log('User verification failed');
                    await logout();
                    router.push('/client/sign-in?error=invalid-session');
                    return;
                }

                // Update last activity
                updateLastActivity();
                setSessionValid(true);
                
                console.log('Client access verified successfully');
                
            } catch (error) {
                console.error('Error verifying client access:', error);
                
                // Only show error dialog for protected pages
                if (!isPublic) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Connection Error',
                        text: 'Unable to verify your session. Please check your connection and try again.',
                        confirmButtonText: 'Retry'
                    });
                }
                
            } finally {
                setIsLoading(false);
                setIsVerifying(false);
            }
        };

        verifyClientAccess();

        // Set up periodic session validation (every 5 minutes) - only for protected pages
        let sessionCheckInterval: NodeJS.Timeout | null = null;
        
        if (!isPublic && isAuthenticated) {
            sessionCheckInterval = setInterval(() => {
                if (isAuthenticated && user?.token) {
                    checkSessionExpiry();
                    updateLastActivity();
                }
            }, 5 * 60 * 1000); // 5 minutes
        }

        return () => {
            if (sessionCheckInterval) {
                clearInterval(sessionCheckInterval);
            }
        };
    }, [hasHydrated, isAuthenticated, user, router, logout, updateLastActivity, checkSessionExpiry, setSessionValid, isPublic]);

    // Show loading spinner ONLY for protected pages while hydrating or verifying
    if (!hasHydrated || (isLoading && !isPublic) || (isVerifying && !isPublic)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        {!hasHydrated ? 'Loading app...' : isVerifying ? 'Verifying your session...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className="min-h-screen bg-white">{children}</div>
        </div>
    );
}