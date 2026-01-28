import { IStatsSummary } from "@/domain/common";
import { errorResponse, successResponse } from "@/lib/api/response-handler";
import { withAdminAuth } from "@/lib/middleware/with-admin-auth";
import { MongoBookingRepository } from "@/repositories/booking-repository";
import { MongoCategoryRepository } from "@/repositories/category-repository";
import { MongoEventRepository } from "@/repositories/event-repository";
import { SummaryService } from "@/services/admin/summary-service";

const eventRepository = new MongoEventRepository();
const categoryRepository = new MongoCategoryRepository();
const bookingRepository = new MongoBookingRepository();
const summaryService = new SummaryService(eventRepository, categoryRepository, bookingRepository);

export const GET = withAdminAuth(async () => {
  try {
    const summary = await summaryService.getSummary();

    return successResponse<IStatsSummary>(summary, 200);
  } catch (error) {
    const err = error as Error;
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
});
