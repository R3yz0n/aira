import { connectMongoose, mongoose } from "@/lib/db/mongoose";
import { IEvent } from "@/domain/event";

export interface IEventDoc {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

const EventSchema = new mongoose.Schema<IEventDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { collection: "events", timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const EventModelInternal = mongoose.models.Event || mongoose.model<IEventDoc>("Event", EventSchema);

export class EventModel {
  static async ensureConnected() {
    await connectMongoose();
    // Ensure all indexes are created/synced
    await EventModelInternal.syncIndexes();
  }

  static async findAll() {
    await this.ensureConnected();
    return EventModelInternal.find().lean();
  }

  static async findById(id: string) {
    await this.ensureConnected();
    return EventModelInternal.findById(id).lean();
  }

  static async findByCategory(categoryId: string) {
    await this.ensureConnected();
    return EventModelInternal.find({ categoryId }).lean();
  }

  static async create(payload: Omit<IEvent, "id">) {
    await this.ensureConnected();

    const doc = await EventModelInternal.create({
      ...payload,
      categoryId: new mongoose.Types.ObjectId(payload.categoryId),
    });

    return doc.toObject();
  }

  static async updateById(id: string, payload: Partial<IEvent>) {
    await this.ensureConnected();
    const updateData: any = { ...payload };
    if (payload.categoryId) {
      updateData.categoryId = new mongoose.Types.ObjectId(payload.categoryId);
    }
    return EventModelInternal.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  static async deleteById(id: string) {
    await this.ensureConnected();
    return EventModelInternal.findByIdAndDelete(id).lean();
  }

  static async countByCategory(categoryId: string) {
    await this.ensureConnected();
    return EventModelInternal.countDocuments({ categoryId });
  }

  static async countDocuments(filter: any = {}) {
    await this.ensureConnected();
    return EventModelInternal.countDocuments(filter);
  }

  static async findPaginated(filter: any, skip: number, limit: number) {
    await this.ensureConnected();
    return EventModelInternal.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }
}
