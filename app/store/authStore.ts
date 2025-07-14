import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '@/types/authstate';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastActivity: null,
      sessionValid: true,
      
      login: (userData) => {
        // Store client auth token in cookie for middleware
        if (typeof document !== 'undefined' && userData.token) {
          document.cookie = `client-auth-token=${userData.token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
        
        set({ 
          user: userData, 
          isAuthenticated: true,
          lastActivity: new Date().toISOString(),
          sessionValid: true
        });
      },
      
      logout: async () => {
        // Call logout API to clear server-side cookies
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Failed to call logout API:', error);
        }
        
        // Clear client auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'client-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          lastActivity: null,
          sessionValid: true
        });
      },
      
      updateToken: (token) => {
        // Update cookie with new token
        if (typeof document !== 'undefined') {
          document.cookie = `client-auth-token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
        }
        
        set((state) => ({
          user: state.user ? { ...state.user, token } : null,
          lastActivity: new Date().toISOString()
        }));
      },
      
      updateLastActivity: () => {
        set({ lastActivity: new Date().toISOString() });
      },
      
      setSessionValid: (valid) => {
        set({ sessionValid: valid });
        
        if (!valid) {
          // If session becomes invalid, logout
          get().logout();
        }
      },
      
      checkSessionExpiry: () => {
        const state = get();
        if (!state.lastActivity) return false;
        
        const lastActivity = new Date(state.lastActivity);
        const now = new Date();
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now.getTime() - lastActivity.getTime() > sessionTimeout) {
          get().logout();
          return false;
        }
        
        return true;
      }
    }),
    {
      name: 'client-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        sessionValid: state.sessionValid
      }),
      onRehydrateStorage: () => (state) => {
        // This runs after the store has been rehydrated from localStorage
        if (state) {
          console.log('Auth store rehydrated:', state.isAuthenticated);
        }
      },
    }
  )
);