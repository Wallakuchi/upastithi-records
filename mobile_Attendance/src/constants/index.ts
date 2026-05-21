import { getApiBaseUrl } from '../config/apiBaseUrl';

/** Resolved API root (emulator vs physical device — see `src/config/apiBaseUrl.ts`). */
export const API_BASE_URL = getApiBaseUrl();

export const APP_CONSTANTS = {
  REQUEST_TIMEOUT: 10000,
  MAX_IMAGE_SIZE: 5242880, // 5MB
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
};

export const PERMISSIONS = {
  CAMERA: 'android.permission.CAMERA',
  LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
};

export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  OUTSIDE_OFFICE: "OUTSIDE_OFFICE"
}
