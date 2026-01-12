import { NextRequest } from "next/server";
import { CloudinaryService, CloudinaryUploadError } from "@/services/cloudinary/cloudinary-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const cloudinaryService = new CloudinaryService();

/**
 * POST /api/admin/upload
 * Upload image to Cloudinary with optimization.
 * - Body: FormData with 'file' field
 * - 200: { url, publicId, width, height, format }
 * - 400: INVALID_INPUT (no file or invalid file)
 * - 500: UPLOAD_FAILED
 */
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("INVALID_INPUT", "No file provided", 400);
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return errorResponse("INVALID_INPUT", "Invalid file type. Allowed: JPG, PNG, WebP, GIF", 400);
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return errorResponse("INVALID_INPUT", "File size too large. Maximum 10MB allowed", 400);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with optimization
    const result = await cloudinaryService.uploadImage(buffer, "events");

    return successResponse(
      {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
      },
      200
    );
  } catch (error: any) {
    if (error instanceof CloudinaryUploadError) {
      return errorResponse("UPLOAD_FAILED", error.message, 500);
    }
    console.error("Upload error:", error);
    return errorResponse("INTERNAL_ERROR", "Failed to upload image", 500);
  }
});
