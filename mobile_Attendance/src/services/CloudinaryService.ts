import axios from 'axios';

const CLOUD_NAME = 'dxaoq8kul';
const UPLOAD_PRESET = 'attendance_app';

export class CloudinaryService {
  static async uploadImage(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: imageUri,
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
        }
      );

      return response.data.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error.response?.data || error);

      throw new Error('Failed to upload image');
    }
  }
}