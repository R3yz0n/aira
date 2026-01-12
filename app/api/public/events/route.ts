import { NextRequest } from "next/server";
import { IEventEntity } from "@/domain/event";
import { MongoEventRepository } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";

const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());

/**
 * GET /api/public/events
 * List all events (public endpoint, no auth required).
 * - Query: ?categoryId=xxx (optional filter by category)
 * - 200: array of events
 * - 500: INTERNAL_ERROR
 */
export async function GET(req: NextRequest) {
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
}
