import { create } from 'zustand';
import { User } from '../types/index';
import { authApi } from '../api/endpoints';
import { appStorage as storage } from '../storage/appStorage';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  login: (user: User, tokens: { access_token: string; refresh_token: string }) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
  restoreToken: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: storage.getString('authToken') || null,
  isLoading: false,
  isAuthenticated: !!storage.getString('authToken'),
  error: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    storage.set('authToken', token);
    set({ token, isAuthenticated: true });
  },

  setError: (error) => set({ error }),

  login: async (user, tokens) => {
    set({ isLoading: true, error: null });
    try {
      set({ 
        user, 
        token: tokens.access_token, 
        isAuthenticated: true 
      });
      storage.set('authToken', tokens.access_token);
      if (tokens.refresh_token) {
        storage.set('refreshToken', tokens.refresh_token);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.delete('authToken');
      storage.delete('refreshToken');
      set({ user: null, token: null, isAuthenticated: false, error: null });
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.getCurrentUser();
      set({ user: response.data.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getAccessToken: () => {
  return storage.getString('authToken') || null;
},

  getRefreshToken: () => {
    return storage.getString('refreshToken') || null;
  },

  setTokens: (tokens) => {
    storage.set('authToken', tokens.access_token);

    if (tokens.refresh_token) {
      storage.set('refreshToken', tokens.refresh_token);
    }

    set({
      token: tokens.access_token,
      isAuthenticated: true,
    });
  },
  restoreToken: () => {
    const token = storage.getString('authToken');

    set({
      token: token || null,
      isAuthenticated: !!token,
    });
  },
}));
