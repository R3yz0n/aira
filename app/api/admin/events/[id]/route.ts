import { NextRequest } from "next/server";
import {
  InvalidCategoryIdError,
  InvalidEventIdError,
  MongoEventRepository,
} from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventNotFoundError, EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";
import { IEventEntity, eventIdSchema, imageFileSchema, eventUpdateSchema } from "@/domain/event";
import {
  CloudinaryQuotaError,
  CloudinaryService,
  CloudinaryUploadError,
} from "@/services/cloudinary/cloudinary-service";
const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());
const cloudinaryService = new CloudinaryService();

/**
 * DELETE /api/admin/events/:id
 * Deletes an event by ID (admin only).
 * - Path: id (event ID as MongoDB ObjectId)
 * - 200: deleted event data
 * - 400: INVALID_INPUT (invalid event ID format)
 * - 404: EVENT_NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const DELETE = withAdminAuth(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      // Validate event ID format
      const validation = eventIdSchema.safeParse({ id });
      if (!validation.success) {
        return errorResponse(
          "INVALID_INPUT",
          "Invalid event ID format",
          400,
          validation.error.flatten(),
        );
      }

      // Delete the event
      const deleted: IEventEntity = await eventService.delete(id);

      // Delete the image from Cloudinary using stored publicId
      if (deleted.publicId) {
        await cloudinaryService.deleteImage(deleted.publicId);
      }

      const payload: IEventEntity = {
        id: deleted.id,
        title: deleted.title,
        description: deleted.description,
        imageUrl: deleted.imageUrl,
        categoryId: deleted.categoryId,
        publicId: deleted.publicId,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt,
      };

      return successResponse<IEventEntity>(payload, 200);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof EventNotFoundError) {
        return errorResponse("EVENT_NOT_FOUND", "Event not found", 404);
      }
      if (err instanceof InvalidCategoryIdError) {
        return errorResponse("INVALID_INPUT", err.message, 400);
      }
      if (err instanceof InvalidEventIdError) {
        return errorResponse("INVALID_INPUT", err.message, 400);
      }
      return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
    }
  },
);

/**
 * PATCH /api/admin/events/:id
 * Updates an event by ID (admin only).
 * - Path: id (event ID as MongoDB ObjectId)
 * - Body: Partial event data (title, description, categoryId, etc.)
 * - Deletes the old image from Cloudinary if a new image is provided.
 * - 200: updated event data
 * - 400: INVALID_INPUT (invalid event ID format or input validation errors)
 * - 404: EVENT_NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const PATCH = withAdminAuth(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      // Validate event ID format
      const idValidation = eventIdSchema.safeParse({ id });
      if (!idValidation.success) {
        return errorResponse(
          "INVALID_INPUT",
          "Invalid event ID format",
          400,
          idValidation.error.flatten(),
        );
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const title = formData.get("title") as string | null;
      const description = formData.get("description") as string | null;
      const categoryId = formData.get("categoryId") as string | null;

      // Validate input data
      const updateData: Record<string, any> = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (categoryId) updateData.categoryId = categoryId;

      if (file) {
        const fileValidation = imageFileSchema.safeParse({ file });
        if (!fileValidation.success) {
          return errorResponse(
            "INVALID_INPUT",
            "Invalid file",
            400,
            fileValidation.error.flatten(),
          );
        }

        // Upload new image to Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await cloudinaryService.uploadImage(buffer, "events");
        updateData.imageUrl = uploadResult.url;
        updateData.publicId = uploadResult.publicId;
      }

      // Validate the entire updateData object
      const validation = eventUpdateSchema.safeParse(updateData);
      if (!validation.success) {
        return errorResponse(
          "INVALID_INPUT",
          "Invalid event data",
          400,
          validation.error.flatten(),
        );
      }

      // Fetch the existing event to delete the old image if necessary
      const existingEvent = await eventService.findById(id);
      if (!existingEvent) {
        return errorResponse("EVENT_NOT_FOUND", "Event not found", 404);
      }

      // Update the event
      const updated = await eventService.update(id, validation.data);

      // Delete the old image if a new one was uploaded
      if (file && existingEvent.publicId) {
        await cloudinaryService.deleteImage(existingEvent.publicId);
      }

      const payload: IEventEntity = {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        imageUrl: updated.imageUrl,
        categoryId: updated.categoryId,
        publicId: updated.publicId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };

      return successResponse<IEventEntity>(payload, 200);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof EventNotFoundError) {
        return errorResponse("EVENT_NOT_FOUND", "Event not found", 404);
      }
      if (err instanceof InvalidCategoryIdError) {
        return errorResponse("INVALID_INPUT", err.message, 400);
      }
      if (err instanceof InvalidEventIdError) {
        return errorResponse("INVALID_INPUT", err.message, 400);
      }
      if (err instanceof CloudinaryQuotaError) {
        return errorResponse(
          "QUOTA_EXCEEDED",
          "Storage quota exceeded. Please contact support.",
          429,
        );
      }
      if (err instanceof CloudinaryUploadError) {
        if (err.message && err.message.includes("File size too large")) {
          return errorResponse("UPLOAD_FAILED", err.message, 413);
        }
        return errorResponse("UPLOAD_FAILED", err.message, 500);
      }
      return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
    }
  },
);
