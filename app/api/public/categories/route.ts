import { ICategoryEntity } from "@/domain/category";
import { errorResponse, successResponse } from "@/lib/api/response-handler";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { MongoEventRepository } from "@/repositories/event-repository";
import { CategoryService } from "@/services/category/category-service";

const categoryService = new CategoryService(new MongoCategoryRepository());
const eventRepository = new MongoEventRepository();

/**
 * GET /api/public/categories
 * Public endpoint to list all categories.
 * - 200: array of categories
 * - 500: INTERNAL_ERROR
 */
export async function GET() {
  try {
    const payload = await categoryService.listWithEventCounts(eventRepository);

    return successResponse<ICategoryEntity[]>(payload, 200);
  } catch (err) {
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
}
