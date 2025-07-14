import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';

export function useClientAuth() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const authStore = useAuthStore();

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
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [authStore]);

  // Return the auth state along with hydration status
  return {
    ...authStore,
    hasHydrated,
    // Helper to check if user is truly authenticated (after hydration)
    isAuthenticatedAndHydrated: hasHydrated && authStore.isAuthenticated,
  };
}
