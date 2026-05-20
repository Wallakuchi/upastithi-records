import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/endpoints';
import { User } from '../types/index';

/**
 * Optional hook aligned with `useAuthStore` + `authApi` (axios responses).
 * Most screens call `authApi` / the store directly; this is here for reuse.
 */
export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    setError,
    restoreToken,
    getAccessToken,
    getRefreshToken,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);

      try {
        const response = await authApi.login(email, password);
        const body = response.data;

        if (!body.success || !body.data) {
          throw new Error(body.message || 'Login failed');
        }

        const { user: u, tokens } = body.data;
        await storeLogin(u, tokens);

        return { success: true, user: u, tokens };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Login failed';
        setError(errorMessage);
        throw err;
      }
    },
    [storeLogin, setError],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      await storeLogout();
    }
  }, [storeLogout]);

  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  const checkAuthenticated = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshToken);
      const body = response.data;

      if (!body.success || !body.data) {
        throw new Error('Token refresh failed');
      }

      const { tokens: newTokens } = body.data;
      useAuthStore.getState().setTokens(newTokens);

      return newTokens.access_token;
    } catch (err: any) {
      setError(err.message || 'Token refresh failed');
      await storeLogout();
      throw err;
    }
  }, [getRefreshToken, storeLogout, setError]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    checkAuthenticated,
    refreshAccessToken,
    restoreToken,
    getAccessToken,
    getRefreshToken,
  };
};
