// backend-api/src/types/index.ts

export interface User {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'hr' | 'employee';
  designation: string;
  department: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  attendance_date: Date;
  check_in_time?: Date;
  check_out_time?: Date;
  check_in_lat?: number;
  check_in_lng?: number;
  check_out_lat?: number;
  check_out_lng?: number;
  check_in_photo?: string;
  check_out_photo?: string;
  check_in_device?: string;
  check_out_device?: string;
  attendance_status: 'present' | 'absent' | 'late' | 'outside_office';
  remarks?: string;
  created_at: Date;
}

export interface OfficeSettings {
  id: string;
  office_name: string;
  office_latitude: number;
  office_longitude: number;
  allowed_radius: number;
  office_start_time: string;
  office_end_time: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface CheckInRequest {
  employee_id: string;
  latitude: number;
  longitude: number;
  selfie_photo: string; // base64 or file
  device_info: string;
}

export interface CheckOutRequest {
  employee_id: string;
  latitude: number;
  longitude: number;
  selfie_photo: string;
  device_info: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
