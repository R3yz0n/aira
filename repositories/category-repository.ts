import { ICategory } from "@/domain/category";
import { CategoryModel } from "@/lib/models/category";

export interface CategoryRepository {
  list(): Promise<ICategory[]>;
  create(data: Pick<ICategory, "name" | "description">): Promise<ICategory>;
  update(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
}

function mapDoc(doc: any): ICategory {
  return {
    id: doc._id ? String(doc._id) : "",
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoCategoryRepository implements CategoryRepository {
  async list(): Promise<ICategory[]> {
    const docs = await CategoryModel.findAll();
    return docs.map(mapDoc);
  }

  async create(data: Pick<ICategory, "name" | "description">): Promise<ICategory> {
    const doc = await CategoryModel.create(data);
    return mapDoc(doc);
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    const doc = await CategoryModel.updateById(id, data);
    return doc ? mapDoc(doc) : null;
  }
}
