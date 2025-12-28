import { IAdmin } from "@/domain/admin";
import { AdminModel } from "@/lib/models/admin";

export interface AdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
}

export class MongoAdminRepository implements AdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    const doc = await AdminModel.findByEmail(email);
    if (!doc) return null;

    return {
      id: doc._id ? String(doc._id) : "",
      email: doc.email,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
