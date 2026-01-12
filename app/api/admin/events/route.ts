import { NextRequest } from "next/server";
import { eventCreateSchema, IEventEntity } from "@/domain/event";
import { MongoEventRepository, InvalidCategoryError } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { CategoryNotFoundError, EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());

/**
 * POST /api/admin/events
 * Creates an event.
 * - Body: { title, description, imageUrl, categoryId }
 * - 201: created event
 * - 400: INVALID_INPUT (validation errors or invalid category)
 * - 404: CATEGORY_NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = eventCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsed.error.flatten());
    }

    const created = await eventService.create(parsed.data);
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
