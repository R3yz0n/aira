import { IAdminEntity } from "@/domain/admin";
import { AdminModel } from "@/lib/models/admin";
import { formatTimestamps } from "@/lib/utils/format-entity";

export interface AdminRepository {
  findByEmail(email: string): Promise<IAdminEntity | null>;
}

export class MongoAdminRepository implements AdminRepository {
  async findByEmail(email: string): Promise<IAdminEntity | null> {
    const doc = await AdminModel.findByEmail(email);
    if (!doc) return null;

    return formatTimestamps({
      id: doc._id ? String(doc._id) : "",
      email: doc.email,
      password: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
