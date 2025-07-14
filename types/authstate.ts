import type { UserData } from './userdata';

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  lastActivity: string | null;
  sessionValid: boolean;
  login: (userData: UserData & { isAdmin?: boolean }) => void;
  logout: () => Promise<void>;
  updateToken: (token: string) => void;
  updateLastActivity: () => void;
  setSessionValid: (valid: boolean) => void;
  checkSessionExpiry: () => boolean;
}