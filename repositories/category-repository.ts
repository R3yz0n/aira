import { ICategoryEntity } from "@/domain/category";
import { CategoryModel } from "@/lib/models/category";
import { formatTimestamps } from "@/lib/utils/format-entity";

export interface CategoryRepository {
  list(): Promise<ICategoryEntity[]>;
  findById(id: string): Promise<ICategoryEntity | null>;
  create(data: Pick<ICategoryEntity, "name" | "description">): Promise<ICategoryEntity>;
  update(id: string, data: Partial<ICategoryEntity>): Promise<ICategoryEntity | null>;
  countAll(): Promise<number>;
}

function mapDoc(doc: any): ICategoryEntity {
  return formatTimestamps({
    id: doc._id ? String(doc._id) : "",
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export class DuplicateCategoryError extends Error {
  constructor(message = "Category already exists") {
    super(message);
    this.name = "DuplicateCategoryError";
  }
}

export class InvalidCategoryIdError extends Error {
  constructor(message = "Invalid category ID format") {
    super(message);
    this.name = "InvalidCategoryIdError";
  }
}

export class MongoCategoryRepository implements CategoryRepository {
  async list(): Promise<ICategoryEntity[]> {
    const docs: ICategoryEntity[] = await CategoryModel.findAll();

    return docs.map(mapDoc);
  }

  async findById(id: string): Promise<ICategoryEntity | null> {
    try {
      const doc = await CategoryModel.findById(id);
      return doc ? mapDoc(doc) : null;
    } catch (err: any) {
      // Handle invalid ObjectId format
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidCategoryIdError("Invalid category ID format");
      }
      throw err;
    }
  }

  async create(data: Pick<ICategoryEntity, "name" | "description">): Promise<ICategoryEntity> {
    try {
      const doc = await CategoryModel.create(data);
      return mapDoc(doc);
    } catch (err: any) {
      // translate Mongo duplicate key error into a repository-level error
      if (err?.name === "MongoServerError" && err?.code === 11000) {
        throw new DuplicateCategoryError("Category with this name already exists");
      }
      throw err;
    }
  }

  async update(id: string, data: Partial<ICategoryEntity>): Promise<ICategoryEntity | null> {
    try {
      const doc: ICategoryEntity = await CategoryModel.updateById(id, data);
      return doc ? mapDoc(doc) : null;
    } catch (err: any) {
      // Handle invalid ObjectId format
      if (err?.name === "CastError" || err?.name === "BSONError") {
        throw new InvalidCategoryIdError("Invalid category ID format");
      }
      // Handle duplicate key error
      if (err?.name === "MongoServerError" && err?.code === 11000) {
        throw new DuplicateCategoryError("Category with this name already exists");
      }
      throw err;
    }
  }

  async countAll(): Promise<number> {
    return CategoryModel.countDocuments();
  }
}
