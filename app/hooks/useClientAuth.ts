import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';

interface UseClientAuthOptions {
  requireAuth?: boolean;
  skipRedirect?: boolean;
}

export function useClientAuth(options: UseClientAuthOptions = {}) {
  const { requireAuth = true, skipRedirect = false } = options;
  const [hasHydrated, setHasHydrated] = useState(false);
  const authStore = useAuthStore();
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

  useEffect(() => {
    // Check if we're on the client side and if the store has been hydrated
    if (typeof window !== 'undefined') {
      // Wait a bit for Zustand to hydrate from localStorage
      const timer = setTimeout(() => {
        setHasHydrated(true);
        
        // After hydration, check if we have a valid session
        if (authStore.isAuthenticated && authStore.user?.token) {
          // Check if session has expired
          if (!authStore.checkSessionExpiry()) {
            console.log('Session expired during hydration, clearing auth state');
            authStore.logout();
          }
        }

        // Handle redirects based on authentication requirements
        if (!skipRedirect) {
          const isPublic = isPublicPath();
          const isSignInPage = window.location.pathname === '/client/sign-in';
          
          // Only redirect if:
          // 1. Authentication is required
          // 2. Current page is not public
          // 3. User is not authenticated
          // 4. Not already on sign-in page
          if (requireAuth && !isPublic && !authStore.isAuthenticated && !isSignInPage) {
            console.log('No client auth token found, redirecting to sign-in');
            router.push('/client/sign-in');
          }
          
          // If user is authenticated but on sign-in page, redirect to dashboard or home
          if (authStore.isAuthenticated && isSignInPage) {
            console.log('User already authenticated, redirecting from sign-in');
            router.push('/client/home'); // redirect authenticated users to home
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [authStore, requireAuth, skipRedirect, router]);

  // Return the auth state along with hydration status
  return {
    ...authStore,
    hasHydrated,
    // Helper to check if user is truly authenticated (after hydration)
    isAuthenticatedAndHydrated: hasHydrated && authStore.isAuthenticated,
  };
}