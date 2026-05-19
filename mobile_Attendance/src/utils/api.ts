// mobile-app/src/utils/api.ts

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';
import { ApiResponse } from '../types/index';

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000/api';
const API_BASE_URL = 'http://192.168.1.100:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = useAuthStore.getState().getRefreshToken();
            if (!refreshToken) {
              useAuthStore.getState().logout();
              return Promise.reject(error);
            }

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { tokens } = response.data.data;
            useAuthStore.getState().setTokens(tokens);

            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(path: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.get(path, config).then((res) => res.data);
  }

  async post<T>(path: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.post(path, data, config).then((res) => res.data);
  }

  async put<T>(path: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.put(path, data, config).then((res) => res.data);
  }

  async delete<T>(path: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.delete(path, config).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();

// Auth API methods
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refresh_token: refreshToken }),

  logout: () => apiClient.post('/auth/logout'),

  getProfile: () => apiClient.get('/auth/me'),
};

// Attendance API methods
export const attendanceApi = {
  checkIn: (data: any) => apiClient.post('/attendance/check-in', data),

  checkOut: (data: any) => apiClient.post('/attendance/check-out', data),

  getToday: (employeeId: string) =>
    apiClient.get(`/attendance/today?employee_id=${employeeId}`),

  getHistory: (employeeId: string, page = 1, limit = 20) =>
    apiClient.get(`/attendance/history?employee_id=${employeeId}&page=${page}&limit=${limit}`),
};

// Leave API methods
export const leaveApi = {
  create: (data: any) => apiClient.post('/leaves', data),

  getAll: (page = 1, limit = 20) =>
    apiClient.get(`/leaves?page=${page}&limit=${limit}`),

  update: (id: string, data: any) => apiClient.put(`/leaves/${id}`, data),
};

// Settings API methods
export const settingsApi = {
  getOfficeSettings: () => apiClient.get('/office-settings'),

  updateOfficeSettings: (data: any) => apiClient.put('/office-settings', data),
};
