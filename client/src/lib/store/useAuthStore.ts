import {
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setTokenToLocalStorage,
} from '@/lib/tokens';
import { decodeUserId } from '@/utils/decodeJWT';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: number | null;
  setUser: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: decodeUserId(getTokenFromLocalStorage() || ''),
      setUser: (token) => {
        setTokenToLocalStorage(token);
        set({ userId: decodeUserId(token) });
      },
      logout: () => {
        removeTokenFromLocalStorage();
        set({ userId: null });
      },
      checkAuth: () => {
        const token = getTokenFromLocalStorage();
        set({ userId: decodeUserId(token || '') });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
