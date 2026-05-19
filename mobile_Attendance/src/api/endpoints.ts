import apiClient from './client';
import { ApiResponse, User } from '../types/index';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: User; tokens: { access_token: string; refresh_token: string } }>>('/auth/login', {
      email,
      password,
    }),

  logout: () => apiClient.post<ApiResponse>('/auth/logout'),

  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ tokens: { access_token: string; refresh_token: string } }>>('/auth/refresh'),
};

export const attendanceApi = {
  checkIn: (location: { latitude: number; longitude: number }, photo?: string) =>
    apiClient.post('/attendance/check-in', { location, photo }),

  checkOut: (location?: { latitude: number; longitude: number }) =>
    apiClient.post('/attendance/check-out', { location }),

  getHistory: (startDate?: string, endDate?: string, page?: number, limit?: number) =>
    apiClient.get('/attendance/history', { 
      params: { 
        from_date: startDate,
        to_date: endDate,
        page: page || 1,
        limit: limit || 20
      }
    }),

  getToday: () =>
    apiClient.get('/attendance/today'),
};

export const leaveApi = {
  requestLeave: (startDate: string, endDate: string, leaveType: string, reason: string) =>
    apiClient.post('/leaves', { 
      from_date: startDate, 
      to_date: endDate, 
      leave_type: leaveType,
      reason 
    }),

  getLeaves: (page?: number, limit?: number) =>
    apiClient.get('/leaves', { 
      params: { 
        page: page || 1, 
        limit: limit || 20 
      } 
    }),

  getAll: (page?: number, limit?: number) =>
    apiClient.get('/leaves', { 
      params: { 
        page: page || 1, 
        limit: limit || 20 
      } 
    }),

  create: (payload: { from_date: string; to_date: string; leave_type: string; reason: string }) =>
    apiClient.post('/leaves', payload),

  approveLeave: (leaveId: string, remarks?: string) =>
    apiClient.put(`/leaves/${leaveId}`, { status: 'APPROVED', remarks }),

  rejectLeave: (leaveId: string, reason: string) =>
    apiClient.put(`/leaves/${leaveId}`, { status: 'REJECTED', remarks: reason }),
};
