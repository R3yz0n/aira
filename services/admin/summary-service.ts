import { EventRepository } from "@/repositories/event-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { BookingRepository } from "@/repositories/booking-repository";

export class SummaryService {
  constructor(
    private eventRepository: EventRepository,
    private categoryRepository: CategoryRepository,
    private bookingRepository: BookingRepository,
  ) {}

  async getSummary() {
    const [totalEvents, totalCategories, totalBookings, latestEvents, latestBookings] =
      await Promise.all([
        this.eventRepository.countAll(),
        this.categoryRepository.countAll(),
        this.bookingRepository.countAll(),
        this.eventRepository.findLatest(5),
        this.bookingRepository.findLatest(5),
      ]);

    return {
      totalEvents,
      totalCategories,
      totalBookings,
      latestEvents,
      latestBookings,
    };
  }
}
