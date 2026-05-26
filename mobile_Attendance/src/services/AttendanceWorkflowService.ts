// mobile-app/src/services/AttendanceWorkflowService.ts

import {LocationService} from './LocationService';
import {CameraService} from './CameraService';
import {attendanceApi} from '../api/endpoints';
import {DeviceInfoService} from './DeviceInfoService';
import {GeoLocation} from '../types/index';

interface CheckInStartResult {
  success: boolean;
  location?: GeoLocation;
  isWithinRadius?: boolean;
  error?: string;
}

interface SelfieUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface AttendanceCompleteResult {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Haversine formula to calculate distance between two GPS coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

/**
 * AttendanceWorkflowService - Orchestrates the complete check-in/check-out workflow
 * Handles: permissions, location fetching, office radius validation, camera capture, and upload
 */
export class AttendanceWorkflowService {
  private static officeLocation: {latitude: number; longitude: number} | null =
    null;
  private static officeRadius: number = 50; // Default 50 meters

  /**
   * Initialize service with flexible office settings
   * For testing: Uses first check-in location as office location
   * For production: Should fetch from backend /office-settings endpoint
   */
  static async initialize(): Promise<void> {
    try {
      // Using default location that can be overridden
      // In testing: first check-in sets the office location
      // In production: fetch from backend API
      if (!this.officeLocation) {
        this.officeLocation = {
          latitude: 28.553306, // Default fallback
          longitude: 77.204705,
        };
        console.log(
          'Office location initialized to default:',
          this.officeLocation,
        );
      }

      // Increased radius for flexibility during testing
      // Adjust based on office size and testing needs
      // Testing: 2000m, Staging: 500m, Production: 100-200m
      // this.officeRadius = 2000; // 2km radius for testing
      this.officeRadius = 20; // 20m radius for testing
      console.log(
        'Attendance service initialized with radius:',
        this.officeRadius,
      );
    } catch (error) {
      console.error('Failed to initialize attendance service:', error);
      // Continue with defaults
    }
  }

  /**
   * Step 1: Start check-in workflow - Request location permission and fetch GPS coordinates
   * Validates if employee is within office radius
   */
  static async startCheckIn(): Promise<CheckInStartResult> {
    try {
      // Request location permission
      const permissionGranted =
        await LocationService.requestLocationPermission();
      if (!permissionGranted) {
        return {
          success: false,
          error:
            'Location permission denied. Please enable location access in settings.',
        };
      }

      // Fetch current GPS coordinates
      const location = await LocationService.getCurrentLocation();

      // Initialize office settings if not already done
      if (!this.officeLocation) {
        await this.initialize();
      }

      // Check if within office radius
      let isWithinRadius = false;
      if (this.officeLocation) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          this.officeLocation.latitude,
          this.officeLocation.longitude,
        );
        isWithinRadius = distance <= this.officeRadius;
        console.log(
          `📍 Distance Calculation: Your Location: (${location.latitude.toFixed(
            4,
          )}, ${location.longitude.toFixed(
            4,
          )}), Office: (${this.officeLocation.latitude.toFixed(
            4,
          )}, ${this.officeLocation.longitude.toFixed(4)}), Distance: ${(
            distance / 1000
          ).toFixed(2)}km, Radius: ${(this.officeRadius / 1000).toFixed(
            2,
          )}km, Within: ${isWithinRadius}`,
        );
      }

      return {
        success: true,
        location,
        isWithinRadius,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to start check-in workflow',
      };
    }
  }

  /**
   * Step 2: Capture selfie using camera and convert to base64
   */
  static async captureAndUploadSelfie(
    onCameraOpen?: () => void,
    onCameraClose?: () => void,
  ): Promise<SelfieUploadResult> {
    try {
      // Request camera permission
      const cameraPermissionGranted =
        await CameraService.requestCameraPermission();
      if (!cameraPermissionGranted) {
        return {
          success: false,
          error:
            'Camera permission denied. Please enable camera access in settings.',
        };
      }

      // Notify that camera is opening
      onCameraOpen?.();

      // Capture selfie and convert to base64 directly
      const base64Photo = await CameraService.captureSelfieAsBase64();

      // Notify camera is closed
      onCameraClose?.();

      return {
        success: true,
        imageUrl: base64Photo,
      };
    } catch (error: any) {
      onCameraClose?.();
      return {
        success: false,
        error: error.message || 'Failed to capture selfie',
      };
    }
  }

  /**
   * Step 3: Complete check-in by uploading to backend
   */
  static async completeCheckIn(
    employeeId: string,
    location: GeoLocation,
    photoUrl: string,
  ): Promise<AttendanceCompleteResult> {
    try {
      const deviceInfo = await DeviceInfoService.getDeviceInfo();

      const payload = {
        employee_id: employeeId,
        latitude: location.latitude,
        longitude: location.longitude,
        selfie_photo: photoUrl,
        device_info: JSON.stringify(deviceInfo),
      };

      console.log('CHECKIN PAYLOAD => ', payload);

      const response = await attendanceApi.checkIn(payload);

      const body = response.data as {
        success?: boolean;
        message?: string;
      };

      if (body?.success) {
        return {
          success: true,
          message: body.message || 'Check-in recorded successfully',
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }

      return {
        success: false,
        error: body?.message || 'Failed to record check-in',
      };
    } catch (error: any) {
      console.log(
        'CHECKIN ERROR =>',
        JSON.stringify(error.response?.data, null, 2),
      );

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to complete check-in',
      };
    }
  }

  /**
   * Step 4: Complete check-out by uploading to backend
   */
  static async completeCheckOut(
    employeeId: string,
    location: GeoLocation,
    photoUrl: string,
  ): Promise<AttendanceCompleteResult> {
    try {
      // Get device information
      const deviceInfo = await DeviceInfoService.getDeviceInfo();

      const payload = {
        employee_id: employeeId,
        latitude: location.latitude,
        longitude: location.longitude,
        selfie_photo: photoUrl,
        device_info: JSON.stringify(deviceInfo),
      };

      const response = await attendanceApi.checkOut(payload);
      const body = response.data as {
        success?: boolean;
        message?: string;
      };

      if (body?.success) {
        return {
          success: true,
          message: body.message || 'Check-out recorded successfully',
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }

      return {
        success: false,
        error: body?.message || 'Failed to record check-out',
      };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to complete check-out';
      return {
        success: false,
        error: typeof msg === 'string' ? msg : 'Failed to complete check-out',
      };
    }
  }

  /**
   * Validate if location is within office radius
   */
  static async validateOfficeRadius(location: GeoLocation): Promise<boolean> {
    if (!this.officeLocation) {
      await this.initialize();
    }

    if (!this.officeLocation) {
      return false; // Cannot validate without office settings
    }

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      this.officeLocation.latitude,
      this.officeLocation.longitude,
    );

    return distance <= this.officeRadius;
  }

  /**
   * Get distance from office
   */
  static async getDistanceFromOffice(location: GeoLocation): Promise<number> {
    if (!this.officeLocation) {
      await this.initialize();
    }

    if (!this.officeLocation) {
      return -1; // Unable to calculate
    }

    return calculateDistance(
      location.latitude,
      location.longitude,
      this.officeLocation.latitude,
      this.officeLocation.longitude,
    );
  }

  /**
   * Get office radius in meters
   */
  static getOfficeRadius(): number {
    return this.officeRadius;
  }

  /**
   * Get office location
   */
  static getOfficeLocation(): {latitude: number; longitude: number} | null {
    return this.officeLocation;
  }
}
