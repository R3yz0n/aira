import { IEventEntity } from "@/domain/event";
import { EventModel } from "@/lib/models/event";

export interface EventRepository {
  findById(id: string): Promise<IEventEntity | null>;
  findByCategory(categoryId: string): Promise<IEventEntity[]>;
  create(data: Omit<IEventEntity, "id" | "createdAt" | "updatedAt">): Promise<IEventEntity>;
  deleteById(id: string): Promise<IEventEntity | null>;
  countByCategory(categoryId: string): Promise<number>;
}

function mapDoc(doc: any): IEventEntity {
  return {
    id: doc._id ? String(doc._id) : "",
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl,
    categoryId: doc.categoryId ? String(doc.categoryId) : "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class InvalidEventIdError extends Error {
  constructor(message = "Invalid event ID format") {
    super(message);
    this.name = "InvalidEventIdError";
  }
}

export class InvalidCategoryError extends Error {
  constructor(message = "Invalid category") {
    super(message);
    this.name = "InvalidCategoryError";
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
        throw new InvalidCategoryError("Invalid category ID format");
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
        throw new InvalidCategoryError("Invalid category ID");
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
        throw new InvalidCategoryError("Invalid category ID format");
      }
      throw err;
    }
  }
}
