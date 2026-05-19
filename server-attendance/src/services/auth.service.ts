// backend-api/src/services/authService.ts

import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.util';
import { JWTPayload, AuthTokens } from '../types/index';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{
    user: any;
    tokens: AuthTokens;
  }> {
    const user = await prisma.employee.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.status) {
      throw new Error('User account is inactive');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(payload);

    return {
      user: {
        id: user.id,
        employee_code: user.employee_code,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const user = await prisma.employee.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.status) {
      throw new Error('User not found or inactive');
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return generateTokenPair(payload);
  }

  /**
   * Register new user
   */
  static async register(data: {
    employee_code: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    designation: string;
    department: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: data.email },
          { employee_code: data.employee_code },
          { phone: data.phone },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email, code, or phone already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.employee.create({
      data: {
        employee_code: data.employee_code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password_hash: hashedPassword,
        designation: data.designation,
        department: data.department,
        role: 'EMPLOYEE',
      },
    });

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(payload);

    return {
      user: {
        id: user.id,
        employee_code: user.employee_code,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await prisma.employee.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isOldPasswordValid = await comparePassword(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.employee.update({
      where: { id: userId },
      data: { password_hash: hashedNewPassword },
    });

    return true;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    return prisma.employee.findUnique({
      where: { id: userId },
      select: {
        id: true,
        employee_code: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        designation: true,
        department: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
