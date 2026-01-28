import { IBookingEntity } from "@/domain/booking";
import { BookingModel } from "@/lib/models/booking";
import { formatTimestamps } from "@/lib/utils/format-entity";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface BookingRepository {
  create(data: Omit<IBookingEntity, "id" | "createdAt" | "updatedAt">): Promise<IBookingEntity>;
  list(
    options: {
      search?: string;
      startDate?: string;
      endDate?: string;
      filters?: any;
    } & PaginationParams,
  ): Promise<{
    data: IBookingEntity[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;
}

function mapDoc(doc: any): IBookingEntity {
  return formatTimestamps({
    id: doc._id ? String(doc._id) : "",
    fullName: doc.fullName,
    phone: doc.phone,
    email: doc.email,
    eventType: doc.eventType,
    eventDate: doc.eventDate,
    budgetRange: doc.budgetRange,
    message: doc.message,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export class MongoBookingRepository implements BookingRepository {
  async create(
    data: Omit<IBookingEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<IBookingEntity> {
    const doc = await BookingModel.create(data);
    return mapDoc(doc);
  }

  async list(
    options: {
      search?: string;
      startDate?: string;
      endDate?: string;
      filters?: any;
    } & PaginationParams,
  ): Promise<{
    data: IBookingEntity[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { search, startDate, endDate, page, limit } = options;
      const skip = (page - 1) * limit;

      // Build MongoDB filter
      const filter: any = {};

      // Add search filter (case-insensitive regex on fullName and email)
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [{ fullName: regex }, { email: regex }];
      }

      // Add date range filter
      if (startDate || endDate) {
        filter.eventDate = {};
        if (startDate) {
          filter.eventDate.$gte = new Date(startDate);
        }
        if (endDate) {
          filter.eventDate.$lte = new Date(endDate);
        }
      }

      // Get total count for pagination
      const total = await BookingModel.countDocuments(filter);

      // Get paginated results sorted by latest (createdAt desc)
      const docs = await BookingModel.findPaginated(filter, skip, limit);

      const data = docs.map(mapDoc);
      const pages = Math.ceil(total / limit);

      return { data, total, page, limit, pages };
    } catch (err: any) {
      throw err;
    }
  }
}
