import { NextRequest } from "next/server";
import { categoryIdSchema, categoryUpdateSchema, ICategoryEntity } from "@/domain/category";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { CategoryNotFoundError, CategoryService } from "@/services/category/category-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const categoryService = new CategoryService(new MongoCategoryRepository());

interface CategoryRouteContext {
  params: { id: string };
}

/**
 * PUT /api/admin/categories/:id
 * Updates a category.
 * - Body: { name?, description? }
 * - 200: updated category
 * - 400: INVALID_INPUT (id or body)
 * - 404: NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const PUT = withAdminAuth<CategoryRouteContext>(async (req: NextRequest, { params }) => {
  try {
    const parsedId = categoryIdSchema.safeParse({ id: params?.id });
    if (!parsedId.success) {
      return errorResponse("INVALID_INPUT", "Invalid category id", 400, parsedId.error.flatten());
    }

    const body = await req.json();
    const parsedBody = categoryUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsedBody.error.flatten());
    }

    const updated = await categoryService.update(parsedId.data.id, parsedBody.data);
    const payload: ICategoryEntity = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      createdAt:
        updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
      updatedAt:
        updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : updated.updatedAt,
    };

    return successResponse<ICategoryEntity>(payload, 200);
  } catch (err) {
    if (err instanceof CategoryNotFoundError) {
      return errorResponse("NOT_FOUND", "Category not found", 404);
    }
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});
