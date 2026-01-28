import { IBooking } from "@/domain/booking";
import { connectMongoose, mongoose } from "@/lib/db/mongoose";
export interface IBookingDoc {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  eventType: string; // Changed from categoryId
  eventDate: Date;
  budgetRange: string;
  message?: string;
  createdAt: Date;
  updatedAt?: Date;
}
const BookingSchema = new mongoose.Schema<IBookingDoc>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    budgetRange: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { collection: "bookings", timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);
const BookingModelInternal =
  mongoose.models.Booking || mongoose.model<IBookingDoc>("Booking", BookingSchema);

export class BookingModel {
  static async ensureConnected() {
    await connectMongoose();
    await BookingModelInternal.syncIndexes();
  }

  static async findAll() {
    await this.ensureConnected();
    return BookingModelInternal.find().lean();
  }

  static async findById(id: string) {
    await this.ensureConnected();
    return BookingModelInternal.findById(id).lean();
  }

  static async create(payload: IBooking) {
    await this.ensureConnected();

    const doc = await BookingModelInternal.create(payload); // Removed categoryId transformation

    return doc.toObject();
  }

  static async findPaginated(filter: any, skip: number, limit: number) {
    await this.ensureConnected();
    return BookingModelInternal.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  static async countDocuments(filter: any = {}) {
    await this.ensureConnected();
    return BookingModelInternal.countDocuments(filter);
  }
}
