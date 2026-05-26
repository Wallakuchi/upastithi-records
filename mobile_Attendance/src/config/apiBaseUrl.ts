import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const API_PORT = 5000;

export const DEV_LAN_HOST = '192.168.1.29';
export const USE_ANDROID_USB_ADB_REVERSE = true;

// 👇 Add your production server URL here
const PRODUCTION_API_URL = 'https://upastithi-records-production.up.railway.app/api';

export function getApiBaseUrl(): string {
  // 👇 Use production URL for release builds
  if (!__DEV__) {
    return PRODUCTION_API_URL;
  }

  const emulator = DeviceInfo.isEmulatorSync();

  if (emulator) {
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${API_PORT}/api`;
    }
    return `http://localhost:${API_PORT}/api`;
  }

  const host = DEV_LAN_HOST.trim();

  if (Platform.OS === 'android' && !host && USE_ANDROID_USB_ADB_REVERSE) {
    return `http://127.0.0.1:${API_PORT}/api`;
  }

  const resolvedHost = host || 'localhost';
  return `http://${resolvedHost}:${API_PORT}/api`;
}