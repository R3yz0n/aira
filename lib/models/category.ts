import { connectMongoose, mongoose } from "@/lib/db/mongoose";
import { ICategory } from "@/domain/category";

export interface ICategoryDoc {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
}

const CategorySchema = new mongoose.Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { collection: "categories", timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

const CategoryModelInternal =
  mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);

export class CategoryModel {
  static async ensureConnected() {
    await connectMongoose();
    // Ensure all indexes are created/synced (including unique constraint on name)
    await CategoryModelInternal.syncIndexes();
  }

  static async findAll() {
    await this.ensureConnected();
    return CategoryModelInternal.find().lean();
  }

  static async findById(id: string) {
    await this.ensureConnected();
    return CategoryModelInternal.findById(id).lean();
  }

  static async create(payload: Pick<ICategory, "name" | "description">) {
    await this.ensureConnected();
    const doc = await CategoryModelInternal.create(payload);
    return doc.toObject();
  }

  static async updateById(id: string, payload: Partial<ICategory>) {
    await this.ensureConnected();
    return CategoryModelInternal.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  static async countDocuments() {
    await this.ensureConnected();
    return CategoryModelInternal.countDocuments();
  }
}

export { CategoryModelInternal as CategoryMongoModel };
