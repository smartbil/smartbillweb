import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '@/types/authstate';

export const useAdminAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastActivity: null,
      sessionValid: true,
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true,
        isAdmin: userData.isAdmin || false,
        lastActivity: new Date().toISOString(),
        sessionValid: true
      }),
      logout: async () => {
        // Call admin logout API to clear server-side cookies
        try {
          await fetch('/api/admin/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Failed to call admin logout API:', error);
        }
        
        // Clear admin auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'admin-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          isAdmin: false,
          lastActivity: null,
          sessionValid: true
        });
      },
      updateToken: (token) => {
        // Update cookie with new token
        if (typeof document !== 'undefined') {
          document.cookie = `admin-auth-token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
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
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        lastActivity: state.lastActivity,
        sessionValid: state.sessionValid
      }),
    }
  )
);