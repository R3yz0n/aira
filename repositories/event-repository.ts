import { IEventEntity } from "@/domain/event";
import { EventModel } from "@/lib/models/event";
import { formatTimestamps } from "@/lib/utils/format-entity";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface EventRepository {
  findById(id: string): Promise<IEventEntity | null>;
  findByCategory(categoryId: string): Promise<IEventEntity[]>;
  list(
    options: { search?: string; categoryId?: string } & PaginationParams
  ): Promise<PaginationResult<IEventEntity>>;
  create(data: Omit<IEventEntity, "id" | "createdAt" | "updatedAt">): Promise<IEventEntity>;
  deleteById(id: string): Promise<IEventEntity | null>;
  countByCategory(categoryId: string): Promise<number>;
}

function mapDoc(doc: any): IEventEntity {
  return formatTimestamps({
    id: doc._id ? String(doc._id) : "",
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl,
    categoryId: doc.categoryId ? String(doc.categoryId) : "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    publicId: doc.publicId,
  });
}

export class InvalidEventIdError extends Error {
  constructor(message = "Invalid event ID format") {
    super(message);
    this.name = "InvalidEventIdError";
  }
}

export class InvalidCategoryIdError extends Error {
  constructor(message = "Invalid category ID format") {
    super(message);
    this.name = "InvalidCategoryIdError";
  }
}

export class MongoEventRepository implements EventRepository {
  async findById(id: string): Promise<IEventEntity | null> {
    try {
      const doc = await EventModel.findById(id);
      return doc ? mapDoc(doc) : null;
    } catch (err: any) {
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidEventIdError("Invalid event ID format");
      }
      throw err;
    }
  }

  async findByCategory(categoryId: string): Promise<IEventEntity[]> {
    try {
      const docs = await EventModel.findByCategory(categoryId);
      return docs.map(mapDoc);
    } catch (err: any) {
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidCategoryIdError("Invalid category ID format");
      }
      throw err;
    }
  }

  async list(
    options: { search?: string; categoryId?: string } & PaginationParams
  ): Promise<PaginationResult<IEventEntity>> {
    try {
      const { search, categoryId, page, limit } = options;
      const skip = (page - 1) * limit;

      // Build MongoDB filter
      const filter: any = {};

      // Add category filter
      if (categoryId) {
        filter.categoryId = categoryId;
      }

      // Add search filter (case-insensitive regex on title and description)
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [{ title: regex }, { description: regex }];
      }

      // Get total count for pagination
      const total = await EventModel.countDocuments(filter);

      // Get paginated results sorted by latest (createdAt desc)
      const docs = await EventModel.findPaginated(filter, skip, limit);

      const data = docs.map(mapDoc);
      const pages = Math.ceil(total / limit);

      return { data, total, page, limit, pages };
    } catch (err: any) {
      // If invalid ObjectId format, return empty results instead of error
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return { data: [], total: 0, page: options.page, limit: options.limit, pages: 0 };
      }
      throw err;
    }
  }

  async create(data: Omit<IEventEntity, "id" | "createdAt" | "updatedAt">): Promise<IEventEntity> {
    try {
      const doc = await EventModel.create(data);
      return mapDoc(doc);
    } catch (err: any) {
      // Handle invalid category ID reference
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidCategoryIdError("Invalid category ID format");
      }
      throw err;
    }
  }

  async deleteById(id: string): Promise<IEventEntity | null> {
    try {
      const doc = await EventModel.deleteById(id);
      return doc ? mapDoc(doc) : null;
    } catch (err: any) {
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidEventIdError("Invalid event ID format");
      }
      throw err;
    }
  }

  async countByCategory(categoryId: string): Promise<number> {
    try {
      return await EventModel.countByCategory(categoryId);
    } catch (err: any) {
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidCategoryIdError("Invalid category ID format");
      }
      throw err;
    }
  }
}
