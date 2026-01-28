import { bookingCreateSchema, IBookingEntity } from "@/domain/booking";
import { errorResponse, successResponse } from "@/lib/api/response-handler";
import { MongoBookingRepository } from "@/repositories/booking-repository";
import { BookingService } from "@/services/booking/booking-service";
import { NextRequest } from "next/server";

const bookingService = new BookingService(new MongoBookingRepository());

/**
 * POST /api/public/bookings
 * Creates a booking (public access).
 * - Body: { fullName, phone, email, eventType, eventDate, budgetRange, message }
 * - 201: created booking
 * - 400: INVALID_INPUT (validation errors)
 * - 429: TOO_MANY_REQUESTS (rate-limited)
 * - 500: INTERNAL_ERROR
 */
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsed.error.flatten());
    }

    // Abuse protection: Add rate-limiting logic here (e.g., IP-based throttling)

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
};
