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
import { IEventEntity, eventIdSchema } from "@/domain/event";
import { CloudinaryService } from "@/services/cloudinary/cloudinary-service";
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
          validation.error.flatten()
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
  }
);
