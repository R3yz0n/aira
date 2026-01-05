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

export class MongoCategoryRepository implements CategoryRepository {
  async list(): Promise<ICategoryEntity[]> {
    const docs = await CategoryModel.findAll();
    return docs.map(mapDoc);
  }

  async create(data: Pick<ICategoryEntity, "name" | "description">): Promise<ICategoryEntity> {
    const doc = await CategoryModel.create(data);
    return mapDoc(doc);
  }

  async update(id: string, data: Partial<ICategoryEntity>): Promise<ICategoryEntity | null> {
    const doc = await CategoryModel.updateById(id, data);
    return doc ? mapDoc(doc) : null;
  }
}
