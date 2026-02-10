import { NextRequest } from "next/server";
import { categoryIdSchema, categoryUpdateSchema, ICategoryEntity } from "@/domain/category";
import {
  DuplicateCategoryError,
  InvalidCategoryIdError,
  MongoCategoryRepository,
} from "@/repositories/category-repository";
import { CategoryNotFoundError, CategoryService } from "@/services/category/category-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuthAndRoleCheck } from "@/lib/middleware/with-admin-auth";

const categoryService = new CategoryService(new MongoCategoryRepository());

interface CategoryRouteContext {
  // Next.js may pass params as a Promise<{ id: string }>
  params: { id: string } | Promise<{ id: string }>;
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
export const PUT = withAdminAuthAndRoleCheck<CategoryRouteContext>(
  async (req: NextRequest, context, _admin) => {
    try {
      // Resolve params (await works whether params is a Promise or a value)
      const params = await context.params;
      const parsedId = categoryIdSchema.safeParse({ id: params.id });
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
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };

      return successResponse<ICategoryEntity>(payload, 200);
    } catch (err: any) {
      if (err instanceof CategoryNotFoundError) {
        return errorResponse("NOT_FOUND", "Category not found", 404);
      }
      if (err instanceof DuplicateCategoryError) {
        return errorResponse("DUPLICATE_CATEGORY", err.message, 409);
      }
      if (err instanceof InvalidCategoryIdError) {
        return errorResponse("INVALID_INPUT", err.message, 400);
      }
      console.error(err);
      return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
    }
  },
);
