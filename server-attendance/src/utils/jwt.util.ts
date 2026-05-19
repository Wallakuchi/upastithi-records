// backend-api/src/utils/jwt.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload, AuthTokens } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_min_32_chars';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_min_32_chars';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  } as SignOptions);
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  } as SignOptions);
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: JWTPayload): AuthTokens {
  return {
    access_token: generateAccessToken(payload),
    refresh_token: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode token without verification
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}
