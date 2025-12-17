import { connectMongoose, mongoose } from "@/lib/db/mongoose";

export interface AdminDoc {
  _id?: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
}

const AdminSchema = new mongoose.Schema<AdminDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { collection: "admins", timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Prevent recompilation in dev
const AdminModelInternal = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export class AdminModel {
  static async ensureConnected() {
    await connectMongoose();
  }

  static async findByEmail(email: string) {
    await this.ensureConnected();
    return AdminModelInternal.findOne({ email }).lean();
  }

  static async findById(id: string) {
    await this.ensureConnected();
    return AdminModelInternal.findById(id).lean();
  }

  static async create(email: string, passwordHash: string) {
    await this.ensureConnected();
    const doc = await AdminModelInternal.create({ email, passwordHash });
    return doc.toObject();
  }

  static async updatePassword(id: string, passwordHash: string) {
    await this.ensureConnected();
    await AdminModelInternal.findByIdAndUpdate(id, { passwordHash }, { new: false });
  }
}

export { AdminModelInternal as AdminMongoModel };
