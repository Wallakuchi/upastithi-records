/**
 * Validates if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Token parsing error:', error);
    return true; // Assume expired if parsing fails
  }
};

/**
 * Formats a token for use in Authorization header
 */
export const formatTokenForHeader = (token: string | null): string => {
  if (!token) return '';
  return `Bearer ${token}`;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Minimum 8 characters required (matching backend requirement)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Gets token expiration time in seconds
 */
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp || null;
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
};

/**
 * Calculates time until token expiration
 * Returns remaining time in seconds, or 0 if expired
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return 0;

    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = expirationTime - now;

    return Math.max(0, timeRemaining);
  } catch (error) {
    console.error('Error calculating token time remaining:', error);
    return 0;
  }
};

/**
 * Checks if token should be refreshed (less than 5 minutes remaining)
 */
export const shouldRefreshToken = (token: string): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  const fiveMinutesInSeconds = 5 * 60;
  return timeRemaining < fiveMinutesInSeconds;
};

/**
 * Extracts user data from JWT token
 */
export const extractUserFromToken = (
  token: string
): Record<string, any> | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload || null;
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
};
