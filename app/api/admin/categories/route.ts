import { NextRequest } from "next/server";
import { categoryCreateSchema, ICategoryEntity } from "@/domain/category";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { CategoryService } from "@/services/category/category-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const categoryService = new CategoryService(new MongoCategoryRepository());

/**
 * GET /api/admin/categories
 * Lists all categories.
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

/**
 * POST /api/admin/categories
 * Creates a category.
 * - Body: { name, description }
 * - 201: created category
 * - 400: INVALID_INPUT (zod issues)
 * - 500: INTERNAL_ERROR
 */
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = categoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsed.error.flatten());
    }

    try {
      const created = await categoryService.create(parsed.data);
      const payload: ICategoryEntity = {
        id: created.id,
        name: created.name,
        description: created.description,
        createdAt:
          created.createdAt instanceof Date ? created.createdAt.toISOString() : created.createdAt,
        updatedAt:
          created.updatedAt instanceof Date ? created.updatedAt.toISOString() : created.updatedAt,
      };

      return successResponse<ICategoryEntity>(payload, 201);
    } catch (err: any) {
      // Handle duplicate-name errors translated by the repository
      const { DuplicateCategoryError } = await import("@/repositories/category-repository");
      if (err instanceof DuplicateCategoryError) {
        return errorResponse("DUPLICATE_RESOURCE", "Category with this name already exists", 409, {
          field: "name",
        });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});
