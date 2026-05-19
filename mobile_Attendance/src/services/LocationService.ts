// mobile-app/src/services/LocationService.ts

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { GeoLocation } from '../types/index';

/**
 * LocationService - Handles GPS location permissions and fetching
 */
export class LocationService {
  /**
   * Request location permission
   */
  static async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for attendance tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // iOS permissions are handled by Info.plist and automatic request dialog
      return true;
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  /**
   * Get current GPS location
   */
  static async getCurrentLocation(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { coords } = position;
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            heading: coords.heading,
            speed: coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Watch position continuously
   */
  static watchPosition(
    onSuccess: (location: GeoLocation) => void,
    onError: (error: Error) => void
  ) {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { coords } = position;
        onSuccess({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          altitude: coords.altitude,
          heading: coords.heading,
          speed: coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        onError(new Error(`Location watch error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return watchId;
  }

  /**
   * Clear location watch
   */
  static clearWatch(watchId: number) {
    Geolocation.clearWatch(watchId);
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
