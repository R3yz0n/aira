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

    // Support multiple categoryIds: comma-separated or repeated param
    let categoryIds: string[] | undefined = undefined;
    const rawCategoryIds = searchParams.get("categoryIds");
    if (rawCategoryIds) {
      categoryIds = rawCategoryIds.split(",").map((id) => id.trim()).filter(Boolean);
      // Validate all categoryIds
      categoryIds = categoryIds.filter((id) => categoryIdSchema.safeParse({ id }).success);
      if (categoryIds.length === 0) categoryIds = undefined;
    } else {
      // Fallback to single categoryId param for backward compatibility
      let categoryId = searchParams.get("categoryId") || undefined;
      if (categoryId) {
        const parsedId = categoryIdSchema.safeParse({ id: categoryId });
        if (parsedId.success) {
          categoryIds = [categoryId];
        }
      }
    }

    // Fetch paginated results
    const result = await eventService.list({ page, limit, search, categoryIds });

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
