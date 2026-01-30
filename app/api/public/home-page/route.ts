import { NextRequest } from "next/server";
import { MongoEventRepository } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { IEventEntity } from "@/domain/event";

const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());

/**
 * GET /api/public/home-page
 * Returns the latest event for every category (public, no auth required).
 * - 200: array of latest events (one per category)
 * - 500: INTERNAL_ERROR
 */
export async function GET(_req: NextRequest) {
  try {
    let events: IEventEntity[] = await eventService.findLatestByCategories();
    if (events.length > 4) {
      // Shuffle and pick 4
      events = events
        .map((e) => ({ e, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, 4)
        .map(({ e }) => e);
    }
    return successResponse<IEventEntity[]>(events, 200);
  } catch (err: unknown) {
    console.log(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
}
