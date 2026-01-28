import { BookingRepository } from "@/repositories/booking-repository";
import { IBookingEntity, TBookingCreateInput, bookingCreateSchema } from "@/domain/booking";

export class BookingService {
  constructor(private bookingRepository: BookingRepository) {}

  async create(input: TBookingCreateInput): Promise<IBookingEntity> {
    // Validate booking fields
    const bookingParsed = bookingCreateSchema.parse(input);

    // Create booking
    return this.bookingRepository.create({
      fullName: bookingParsed.fullName,
      phone: bookingParsed.phone,
      email: bookingParsed.email,
      eventType: bookingParsed.eventType,
      eventDate: new Date(bookingParsed.eventDate),
      budgetRange: bookingParsed.budgetRange,
      message: bookingParsed.message,
    });
  }

  async list(options: {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    data: IBookingEntity[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const filters: any = {};

    if (options.search) {
      filters.$or = [
        { fullName: { $regex: options.search, $options: "i" } },
        { email: { $regex: options.search, $options: "i" } },
      ];
    }

    if (options.startDate || options.endDate) {
      filters.eventDate = {};
      if (options.startDate) {
        filters.eventDate.$gte = new Date(options.startDate);
      }
      if (options.endDate) {
        filters.eventDate.$lte = new Date(options.endDate);
      }
    }

    return this.bookingRepository.list({
      ...options,
      filters,
    });
  }
}
