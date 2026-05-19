// mobile-app/src/services/CameraService.ts

import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import * as FileSystem from 'react-native-fs';

/**
 * CameraService - Handles camera permissions and photo capture
 */
export class CameraService {
  /**
   * Request camera permission
   */
  static async requestCameraPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera for selfies.',
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
      console.error('Camera permission error:', error);
      return false;
    }
  }

  /**
   * Capture selfie from front camera
   * Returns the URI of the captured image
   */
  static async captureSelfie(): Promise<string> {
    return new Promise((resolve, reject) => {
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.7,
          maxWidth: 800,
          maxHeight: 800,
          includeBase64: false,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            reject(new Error('Camera cancelled by user'));
          } else if (response.errorCode) {
            reject(new Error(`Camera error: ${response.errorMessage}`));
          } else if (response.assets && response.assets[0].uri) {
            resolve(response.assets[0].uri);
          } else {
            reject(new Error('No image captured'));
          }
        }
      );
    });
  }

  /**
   * Capture selfie and return as base64
   */
  static async captureSelfieAsBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.7,
          maxWidth: 800,
          maxHeight: 800,
          includeBase64: true,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            reject(new Error('Camera cancelled by user'));
          } else if (response.errorCode) {
            reject(new Error(`Camera error: ${response.errorMessage}`));
          } else if (response.assets && response.assets[0].base64) {
            resolve(response.assets[0].base64);
          } else {
            reject(new Error('No image captured'));
          }
        }
      );
    });
  }

  /**
   * Convert image file URI to base64
   */
  static async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      // Read file from URI and convert to base64
      const base64 = await FileSystem.readFile(imageUri, 'base64');
      return base64;
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      throw new Error('Failed to process image file');
    }
  }
}
