import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export class CloudinaryUploadError extends Error {
  constructor(message = "Failed to upload image to Cloudinary") {
    super(message);
    this.name = "CloudinaryUploadError";
  }
}

export class CloudinaryService {
  /**
   * Upload image buffer to Cloudinary with optimization
   * @param buffer - Image file buffer
   * @param folder - Cloudinary folder (default: 'events')
   * @returns Upload result with URL and metadata
   */
  async uploadImage(buffer: Buffer, folder: string = "events"): Promise<UploadResult> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              // Optimization settings
              transformation: [
                {
                  quality: "auto:best", // Auto quality optimization
                  fetch_format: "auto", // Auto format (WebP, AVIF when supported)
                },
                {
                  width: 1920, // Max width
                  height: 1080, // Max height
                  crop: "limit", // Don't upscale, only downscale if larger
                },
              ],
              // Additional settings
              resource_type: "image",
              allowed_formats: ["jpg", "png", "webp", "gif", "jpeg"],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new CloudinaryUploadError(error.message || "Failed to upload image");
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - Cloudinary public ID
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      // Don't throw - deletion failures shouldn't block operations
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns Public ID or null
   */
  extractPublicId(url: string): string | null {
    try {
      // Example URL: https://res.cloudinary.com/{cloud_name}/image/upload/v123456/events/image.jpg
      const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}
