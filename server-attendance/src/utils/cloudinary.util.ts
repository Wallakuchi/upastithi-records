// backend-api/src/utils/cloudinary.util.ts

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload image from buffer
   */
  static async uploadImage(
    buffer: Buffer,
    fileName: string,
    folder: string = 'attendance'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileName,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No URL returned from Cloudinary'));
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      Readable.from(buffer).pipe(stream);
    });
  }

  /**
   * Upload image from base64
   */
  static async uploadBase64(
    base64Data: string,
    fileName: string,
    folder: string = 'attendance'
  ): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
        folder,
        public_id: fileName,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return result.secure_url;
    } catch (error: any) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Upload image from URL
   */
  static async uploadFromUrl(
    imageUrl: string,
    fileName: string,
    folder: string = 'attendance'
  ): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder,
        public_id: fileName,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return result.secure_url;
    } catch (error: any) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      console.error(`Cloudinary delete failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  static extractPublicId(cloudinaryUrl: string): string {
    try {
      // Extract public ID from Cloudinary URL format:
      // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{extension}
      const parts = cloudinaryUrl.split('/');
      const fileWithExtension = parts[parts.length - 1];
      const fileName = fileWithExtension.split('.')[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${fileName}`;
    } catch {
      return '';
    }
  }

  /**
   * Generate optimized Cloudinary URL with transformations
   */
  static getOptimizedUrl(publicId: string, options: any = {}): string {
    try {
      const url = cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        width: options.width || 500,
        height: options.height || 500,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
        ...options,
      });
      return url;
    } catch (error: any) {
      console.error(`Failed to generate optimized URL: ${error.message}`);
      return '';
    }
  }
}

/**
 * Wrapper function for uploading base64 images
 */
export async function cloudinaryUpload(
  base64Data: string,
  fileName: string,
  folder: string = 'attendance'
): Promise<string> {
  return CloudinaryService.uploadBase64(base64Data, fileName, folder);
}
