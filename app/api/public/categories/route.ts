import { ICategoryEntity } from "@/domain/category";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { CategoryService } from "@/services/category/category-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";

const categoryService = new CategoryService(new MongoCategoryRepository());

/**
 * GET /api/public/categories
 * Public endpoint to list all categories.
 * - 200: array of categories
 * - 500: INTERNAL_ERROR
 */
export async function GET() {
  try {
    const categories = await categoryService.list();
    const payload: ICategoryEntity[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
    }));

    return successResponse<ICategoryEntity[]>(payload, 200);
  } catch (err) {
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
}
