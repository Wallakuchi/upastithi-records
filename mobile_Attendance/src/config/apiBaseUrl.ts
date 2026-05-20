import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const API_PORT = 5000;

/**
 * When testing on a **physical phone over Wi‑Fi** (no USB reverse), set your PC’s LAN IPv4
 * (Windows: `ipconfig`). Ignored when `USE_ANDROID_USB_ADB_REVERSE` is true and host is empty.
 */
export const DEV_LAN_HOST = '192.168.1.29';

/**
 * **Physical Android + USB cable:** set `true` and run once per machine (with device connected):
 *
 *   adb reverse tcp:5000 tcp:5000
 *
 * Traffic to `127.0.0.1:5000` on the phone is forwarded to `localhost:5000` on your PC
 * (same port your Express server uses). No Wi‑Fi IP needed.
 *
 * Set `false` if you only use Wi‑Fi; then set `DEV_LAN_HOST` instead.
 */
export const USE_ANDROID_USB_ADB_REVERSE = true;

/**
 * Base URL for the Express API (`/api` prefix matches server-attendance routes).
 */
export function getApiBaseUrl(): string {
  const emulator = DeviceInfo.isEmulatorSync();

  if (emulator) {
    if (Platform.OS === 'android') {
      // Android emulator: host machine's localhost
      return `http://10.0.2.2:${API_PORT}/api`;
    }
    // iOS simulator (and most iOS dev setups): host localhost is reachable
    return `http://localhost:${API_PORT}/api`;
  }

  const host = DEV_LAN_HOST.trim();

  // Physical Android + USB: adb reverse maps device 127.0.0.1 → host localhost:5000
  if (Platform.OS === 'android' && !host && USE_ANDROID_USB_ADB_REVERSE) {
    return `http://127.0.0.1:${API_PORT}/api`;
  }

  if (!host) {
    console.warn(
      '[API] Physical device: use USB + `adb reverse tcp:5000 tcp:5000` with USE_ANDROID_USB_ADB_REVERSE=true, ' +
        'or set DEV_LAN_HOST to your PC LAN IP (Wi‑Fi). The dashboard uses localhost on the PC; the phone does not.',
    );
  }

  const resolvedHost = host || 'localhost';
  return `http://${resolvedHost}:${API_PORT}/api`;
}
