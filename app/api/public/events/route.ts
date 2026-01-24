import { NextRequest } from "next/server";
import { MongoEventRepository } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { EventService } from "@/services/event/event-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { IEventEntity, IPaginationResult } from "@/domain/event";
import { categoryIdSchema } from "@/domain/category";

const eventService = new EventService(new MongoEventRepository(), new MongoCategoryRepository());

/**
 * GET /api/public/events
 * List events with pagination and optional search/filter (public, no auth required).
 * - Query:
 *   - page=1 (default 1, min 1)
 *   - limit=10 (default 10, max 100)
 *   - search=keyword (optional, searches title + description)
 *   - categoryId=xxx (optional, filter by category)
 * - 200: paginated events with pagination metadata
 * - 500: INTERNAL_ERROR
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse pagination params with defaults and validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Parse optional filters
    const search = searchParams.get("search") || undefined;
    let categoryId = searchParams.get("categoryId") || undefined;

    // Validate categoryId format only if provided
    if (categoryId) {
      const parsedId = categoryIdSchema.safeParse({ id: categoryId });
      if (!parsedId.success) {
        categoryId = undefined; // Ignore invalid categoryId
      }
    }

    // Fetch paginated results
    const result = await eventService.list({ page, limit, search, categoryId });

    // Format response with pagination metadata
    const payload: IPaginationResult<IEventEntity> = {
      data: result.data,
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    };

    return successResponse<IPaginationResult<IEventEntity>>(payload, 200);
  } catch (err: unknown) {
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
}
