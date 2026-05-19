import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/api';
import { User, AuthTokens } from '../types/index';

export const useAuth = () => {
  const {
    user,
    tokens,
    loading,
    error,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    restoreToken,
    getAccessToken,
    getRefreshToken,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApi.login(email, password);

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Login failed');
        }

        const { user, tokens } = response.data;
        await storeLogin(user, tokens);

        return { success: true, user, tokens };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError]
  );

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      await storeLogout();
      setLoading(false);
    }
  }, [storeLogout, setLoading]);

  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  const checkAuthenticated = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  const getTokens = useCallback(() => {
    return tokens;
  }, [tokens]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refresh(refreshToken);

      if (!response.success || !response.data) {
        throw new Error('Token refresh failed');
      }

      const { tokens: newTokens } = response.data;
      useAuthStore.getState().setTokens(newTokens);

      return newTokens.access_token;
    } catch (err: any) {
      setError(err.message || 'Token refresh failed');
      await storeLogout();
      throw err;
    }
  }, [getRefreshToken, storeLogout, setError]);

  return {
    // State
    user,
    tokens,
    loading,
    error,
    isAuthenticated,

    // Actions
    login,
    logout,
    getCurrentUser,
    checkAuthenticated,
    getTokens,
    refreshAccessToken,
    restoreToken,
    getAccessToken,
    getRefreshToken,
  };
};
