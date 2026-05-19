export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
