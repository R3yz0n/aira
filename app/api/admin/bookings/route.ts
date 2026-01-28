import { NextRequest } from "next/server";
import { bookingCreateSchema, IBookingEntity } from "@/domain/booking";
import { MongoBookingRepository, InvalidCategoryIdError } from "@/repositories/booking-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { BookingService } from "@/services/booking/booking-service";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const bookingService = new BookingService(new MongoBookingRepository());

/**
 * POST /api/admin/bookings
 * Creates a booking.
 * - Body: { fullName, phone, email, eventType, eventDate, budgetRange, message }
 * - 201: created booking
 * - 400: INVALID_INPUT (validation errors, invalid category)
 * - 404: CATEGORY_NOT_FOUND
 * - 500: INTERNAL_ERROR
 */
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsed.error.flatten());
    }

    const created = await bookingService.create(parsed.data);
    const payload: IBookingEntity = {
      id: created.id,
      fullName: created.fullName,
      phone: created.phone,
      email: created.email,
      eventType: created.eventType,
      eventDate: created.eventDate,
      budgetRange: created.budgetRange,
      message: created.message,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };

    return successResponse<IBookingEntity>(payload, 201);
  } catch (err: any) {
    if (err instanceof InvalidCategoryIdError) {
      return errorResponse("INVALID_INPUT", err.message, 400);
    }

    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});
