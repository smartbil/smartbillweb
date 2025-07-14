'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/app/store/adminAuthStore';
import Swal from 'sweetalert2';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAdminAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        setIsVerifying(true);
        
        // Check if user is authenticated
        if (!isAuthenticated || !user?.token) {
          console.log('No authentication found, redirecting to sign-in');
          router.push('/admin/sign-in');
          return;
        }

        // Verify admin privileges with backend
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log('Admin verification failed:', response.status);
          
          // Show error message
          await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have admin privileges. Please contact an administrator.',
            confirmButtonText: 'Go to Sign In'
          });
          
          // Clear authentication and redirect
          await logout();
          router.push('/admin/sign-in?error=unauthorized');
          return;
        }

        const data = await response.json();
        
        if (!data.success || !data.isAdmin) {
          console.log('User is not an admin');
          
          await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have admin privileges.',
            confirmButtonText: 'Go to Sign In'
          });
          
          await logout();
          router.push('/admin/sign-in?error=unauthorized');
          return;
        }

        console.log('Admin access verified successfully');
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error verifying admin access:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'Verification Error',
          text: 'Unable to verify admin access. Please try again.',
          confirmButtonText: 'Go to Sign In'
        });
        
        await logout();
        router.push('/admin/sign-in?error=verification-failed');
      } finally {
        setIsVerifying(false);
      }
    };

    // Skip verification for sign-in page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath === '/admin/sign-in') {
        setIsLoading(false);
        return;
      }
    }

    verifyAdminAccess();
  }, [isAuthenticated, user, router, logout]);

  // Show loading spinner while verifying
  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isVerifying ? 'Verifying admin access...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
