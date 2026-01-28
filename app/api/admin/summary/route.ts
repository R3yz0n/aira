import { NextResponse } from "next/server";
import { SummaryService } from "@/services/admin/summary-service";
import { MongoEventRepository } from "@/repositories/event-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { MongoBookingRepository } from "@/repositories/booking-repository";
import { successResponse, errorResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";

const eventRepository = new MongoEventRepository();
const categoryRepository = new MongoCategoryRepository();
const bookingRepository = new MongoBookingRepository();
const summaryService = new SummaryService(eventRepository, categoryRepository, bookingRepository);

export const GET = withAdminAuth(async () => {
  try {
    const summary = await summaryService.getSummary();
    return successResponse(summary, 200);
  } catch (error) {
    const err = error as Error;
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
});
