import { NextRequest } from "next/server";
import { z } from "zod";
import { eventCreateSchema, imageFileSchema, imageUrlSchema, IEventEntity } from "@/domain/event";
import { MongoEventRepository, InvalidCategoryError } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventService } from "@/services/event/event-service";
import {
  CloudinaryService,
  CloudinaryUploadError,
  CloudinaryQuotaError,
} from "@/services/cloudinary/cloudinary-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";
import { CategoryNotFoundError } from "@/services/category/category-service";

const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());
const cloudinaryService = new CloudinaryService();

/**
 * POST /api/admin/events
 * Creates an event with image upload.
 * - Body: FormData with:
 *   - file: Image file
 *   - title: Event title
 *   - description: Event description
 *   - categoryId: Category ID
 * - 201: created event with image URL
 * - 400: INVALID_INPUT (validation errors, invalid category, or invalid file)
 * - 404: CATEGORY_NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    console.log("Received form data:", file.type);
    debugger;

    // Validate file with imageFileSchema
    const fileValidation = imageFileSchema.safeParse({ file });
    if (!fileValidation.success) {
      return errorResponse("INVALID_INPUT", "Invalid file ", 400, fileValidation.error.flatten());
    }

    // Validate event fields with eventCreateSchema (without imageUrl)
    const eventValidation = eventCreateSchema.safeParse({
      title,
      description,
      categoryId,
    });

    if (!eventValidation.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, eventValidation.error.flatten());
    }

    // Upload image to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await cloudinaryService.uploadImage(buffer, "events");

    // Create event with uploaded image URL
    const created = await eventService.create({
      title: eventValidation.data.title,
      description: eventValidation.data.description,
      imageUrl: uploadResult.url,
      categoryId: eventValidation.data.categoryId,
    });

    const payload: IEventEntity = {
      id: created.id,
      title: created.title,
      description: created.description,
      imageUrl: created.imageUrl,
      categoryId: created.categoryId,
      createdAt:
        created.createdAt instanceof Date ? created.createdAt.toISOString() : created.createdAt,
      updatedAt:
        created.updatedAt instanceof Date ? created.updatedAt.toISOString() : created.updatedAt,
    };

    return successResponse<IEventEntity>(payload, 201);
  } catch (err: any) {
    if (err instanceof CloudinaryQuotaError) {
      return errorResponse(
        "QUOTA_EXCEEDED",
        "Storage quota exceeded. Please contact support.",
        429
      );
    }
    if (err instanceof CloudinaryUploadError) {
      return errorResponse("UPLOAD_FAILED", err.message, 500);
    }
    if (err instanceof CategoryNotFoundError) {
      return errorResponse("CATEGORY_NOT_FOUND", "Category not found", 404);
    }
    if (err instanceof InvalidCategoryError) {
      return errorResponse("INVALID_INPUT", err.message, 400);
    }
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});

/**
 * GET /api/admin/events
 * List all events.
 * - Query: ?categoryId=xxx (optional filter by category)
 * - 200: array of events
 * - 500: INTERNAL_ERROR
 */
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    let events: IEventEntity[];
    if (categoryId) {
      events = await eventService.findByCategory(categoryId);
    } else {
      events = await eventService.list();
    }

    const payload = events.map((event) => ({
      ...event,
      createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
      updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
    }));

    return successResponse<IEventEntity[]>(payload, 200);
  } catch (err: any) {
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});
