export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'employee';
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Leave {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  check_in_time?: string;
  check_out_time?: string;
  check_in_lat?: number;
  check_in_lng?: number;
  check_out_lat?: number;
  check_out_lng?: number;
  selfie_photo_url?: string;
  attendance_status?: 'present' | 'late' | 'absent' | 'outside_office';
  date: string;
}

export interface CheckInPayload {
  employee_id: string;
  latitude: number;
  longitude: number;
  selfie_photo: string;
  device_info: {
    os: string;
    osVersion: string;
    model: string;
    appVersion: string;
  };
}
