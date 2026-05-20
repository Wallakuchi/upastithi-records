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

  refreshToken: (refresh_token: string) =>
    apiClient.post<ApiResponse<{ tokens: { access_token: string; refresh_token: string } }>>('/auth/refresh', {
      refresh_token,
    }),
};

/** Matches server `checkInSchema` / `checkOutSchema` (flat body). */
export interface AttendanceCheckPayload {
  employee_id: string;
  latitude: number;
  longitude: number;
  selfie_photo: string;
  /** Optional JSON string — server stores as plain text */
  device_info?: string;
}

export const attendanceApi = {
  checkIn: (payload: AttendanceCheckPayload) =>
    apiClient.post('/attendance/check-in', payload, { timeout: 120000 }),

  checkOut: (payload: AttendanceCheckPayload) =>
    apiClient.post('/attendance/check-out', payload, { timeout: 120000 }),

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
