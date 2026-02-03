import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Validate Cloudinary environment variables
function validateCloudinaryEnv() {
  const requiredVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      throw new Error(`Missing required Cloudinary environment variable: ${variable}`);
    }
  }
}

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
  constructor() {
    validateCloudinaryEnv();
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload image buffer to Cloudinary with optimization
   * @param buffer - Image file buffer
   * @param folder - Cloudinary folder (default: 'events')
   * @param maxSize - Maximum allowed file size in bytes (default: 4MB)
   * @returns Upload result with URL and metadata
   * @throws CloudinaryUploadError if file size exceeds maxSize
   */
  async uploadImage(
    buffer: Buffer,
    folder: string = "events",
    maxSize: number = 4 * 1024 * 1024, // 4MB
  ): Promise<UploadResult> {
    if (buffer.length > maxSize) {
      throw new CloudinaryUploadError(
        `File size too large. Maximum ${maxSize / (1024 * 1024)}MB allowed`,
      );
    }
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
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
              else if (result) {
                resolve(result);
              } else {
                reject(new Error("Cloudinary upload result is undefined"));
              }
            },
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

      // Check for quota exceeded errors using Cloudinary error codes
      if (error.http_code === 507 || error.error?.code === "quota_exceeded") {
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
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await cloudinary.uploader.destroy(publicId);
        return; // Exit if successful
      } catch (error: unknown) {
        attempt++;

        if (error instanceof Error) {
          console.error(`Cloudinary delete error (attempt ${attempt}):`, error.message);
        } else {
          console.error(`Cloudinary delete error (attempt ${attempt}):`, error);
        }

        // Retry only for transient errors (e.g., network issues)
        if (attempt >= maxRetries) {
          console.error(
            `Cloudinary delete failed after ${maxRetries} attempts. Public ID: ${publicId}`,
          );
          return; // Stop retrying after max attempts
        }
      }
    }
  }
}
