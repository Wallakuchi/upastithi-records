// mobile-app/src/services/DeviceInfoService.ts

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface DeviceInfoType {
  os: string;
  osVersion: string;
  model: string;
  appVersion: string;
}

/**
 * DeviceInfoService - Retrieves device and app information
 * Used for attendance records to track which device marked attendance
 */
export class DeviceInfoService {
  /**
   * Get complete device information
   */
  static async getDeviceInfo(): Promise<DeviceInfoType> {
    try {
      const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
      const osVersion = Platform.OS === 'ios' 
        ? await DeviceInfo.getSystemVersion() 
        : await DeviceInfo.getApiLevel().then(level => `API ${level}`);
      const model = await DeviceInfo.getModel();
      const appVersion = await DeviceInfo.getVersion();

      return {
        os,
        osVersion,
        model,
        appVersion,
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      // Return defaults if unable to get info
      return {
        os: Platform.OS === 'ios' ? 'iOS' : 'Android',
        osVersion: 'unknown',
        model: 'unknown',
        appVersion: '1.0.0',
      };
    }
  }

  /**
   * Get device model
   */
  static async getModel(): Promise<string> {
    try {
      return await DeviceInfo.getModel();
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get OS version
   */
  static async getOSVersion(): Promise<string> {
    try {
      return Platform.OS === 'ios' 
        ? await DeviceInfo.getSystemVersion() 
        : await DeviceInfo.getApiLevel().then(level => `API ${level}`);
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get app version
   */
  static async getAppVersion(): Promise<string> {
    try {
      return await DeviceInfo.getVersion();
    } catch {
      return '1.0.0';
    }
  }

  /**
   * Get unique device identifier
   */
  static async getUniqueID(): Promise<string> {
    try {
      return await DeviceInfo.getUniqueId();
    } catch {
      return 'unknown';
    }
  }
}
