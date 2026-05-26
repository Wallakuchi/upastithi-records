import axios from 'axios';
import {Platform} from 'react-native';

const CLOUD_NAME = 'dxaoq8kul';
const UPLOAD_PRESET = 'attendance_app';

export class CloudinaryService {
  static async uploadImage(imageUri: string): Promise<string> {
    try {
      console.log('UPLOAD URI => ', imageUri);

      const formData = new FormData();

      formData.append('file', {
        uri:
          Platform.OS === 'android'
            ? imageUri
            : imageUri.replace('file://', ''),
        type: 'image/jpeg',
        name: `attendance_${Date.now()}.jpg`,
      } as any);

      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        },
      );

      console.log('UPLOAD SUCCESS => ', response.data);

      if (!response.data.secure_url) {
        throw new Error('No secure_url in Cloudinary response');
      }

      return response.data.secure_url;
    } catch (error: any) {
      console.error('CLOUDINARY ERROR DETAILS => ', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        errorField: error.response?.data?.error,
      });

      throw new Error(
        error.response?.data?.error?.message || 
        error.message ||
        'Failed to upload image',
      );
    }
  }
}