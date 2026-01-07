import { ICategoryEntity } from "@/domain/category";
import { CategoryModel } from "@/lib/models/category";

export interface CategoryRepository {
  list(): Promise<ICategoryEntity[]>;
  create(data: Pick<ICategoryEntity, "name" | "description">): Promise<ICategoryEntity>;
  update(id: string, data: Partial<ICategoryEntity>): Promise<ICategoryEntity | null>;
}

function mapDoc(doc: any): ICategoryEntity {
  return {
    id: doc._id ? String(doc._id) : "",
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class DuplicateCategoryError extends Error {
  constructor(message = "Category already exists") {
    super(message);
    this.name = "DuplicateCategoryError";
  }
}

export class MongoCategoryRepository implements CategoryRepository {
  async list(): Promise<ICategoryEntity[]> {
    const docs = await CategoryModel.findAll();
    return docs.map(mapDoc);
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
    const doc = await CategoryModel.updateById(id, data);
    return doc ? mapDoc(doc) : null;
  }
}
