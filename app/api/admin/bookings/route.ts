import {
  bookingCreateSchema,
  dateSchema,
  IBookingEntity,
  IPaginationResult,
} from "@/domain/booking";
import { errorResponse, successResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";
import { MongoBookingRepository } from "@/repositories/booking-repository";
import { BookingService } from "@/services/booking/booking-service";
import { NextRequest } from "next/server";

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
    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});

/**
 * GET /api/admin/bookings
 * List bookings with pagination and optional search/filter (admin, auth required).
 * - Query:
 *   - page=1 (default 1, min 1)
 *   - limit=10 (default 10, max 100)
 *   - search=keyword (optional, searches fullName + email)
 *   - startDate=yyyy-mm-dd (optional, filter by start date)
 *   - endDate=yyyy-mm-dd (optional, filter by end date)
 * - 200: paginated bookings with pagination metadata
 * - 500: INTERNAL_ERROR
 */
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // Parse pagination params with defaults and validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Parse optional filters
    const search = searchParams.get("search") || undefined;
    let eventType = searchParams.get("eventType") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    // Validate date filters
    let validStartDate: string | undefined = undefined;
    let validEndDate: string | undefined = undefined;

    if (startDate) {
      const parsedStartDate = dateSchema.safeParse(startDate);
      if (parsedStartDate.success) {
        validStartDate = startDate;
      }
    }

    if (endDate) {
      const parsedEndDate = dateSchema.safeParse(endDate);
      if (parsedEndDate.success) {
        validEndDate = endDate;
      }
    }

    // Ensure logical consistency between startDate and endDate
    if (validStartDate && validEndDate && new Date(validStartDate) > new Date(validEndDate)) {
      return errorResponse("INVALID_DATE_RANGE", "Start Date cannot be after End Date", 400);
    }

    // Fetch paginated results
    const result = await bookingService.list({
      page,
      limit,
      search,
      startDate: validStartDate,
      endDate: validEndDate,
    });

    // Format response with pagination metadata
    const payload = {
      data: result.data,
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    };

    return successResponse<IPaginationResult<IBookingEntity>>(payload, 200);
  } catch (err: unknown) {
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
});

export default GET;
