import { IAdminEntity } from "@/domain/admin";
import { AdminModel } from "@/lib/models/admin";

export interface AdminRepository {
  findByEmail(email: string): Promise<IAdminEntity | null>;
}

export class MongoAdminRepository implements AdminRepository {
  async findByEmail(email: string): Promise<IAdminEntity | null> {
    const doc = await AdminModel.findByEmail(email);
    if (!doc) return null;

    return {
      id: doc._id ? String(doc._id) : "",
      email: doc.email,
      password: doc.passwordHash,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
