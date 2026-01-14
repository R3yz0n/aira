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

export class CloudinaryQuotaError extends Error {
  constructor(message = "Storage quota exceeded") {
    super(message);
    this.name = "CloudinaryQuotaError";
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
              resource_type: "image",
              allowed_formats: ["jpg", "png", "webp", "gif", "jpeg"],
              // Eager transformations: create optimized versions during upload
              eager: [
                {
                  quality: "auto:best", // Smart compression - maintains visual quality
                  fetch_format: "auto", // Auto WebP/AVIF conversion (50% smaller, same quality)
                  width: 1920,
                  height: 1080,
                  crop: "limit", // Only resize if larger
                },
              ],
              eager_async: false, // Wait for transformation to complete
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      // Use the eager transformed URL (optimized version)
      const optimizedUrl = result.eager?.[0]?.secure_url || result.secure_url;

      return {
        url: optimizedUrl,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);

      // Check for quota exceeded errors
      if (error.message?.includes("quota") || error.message?.includes("limit")) {
        throw new CloudinaryQuotaError();
      }

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
