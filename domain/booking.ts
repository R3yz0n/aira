import { z } from "zod";

/**
 * Booking domain entity interface
 */
export interface IBooking {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: Date;
  budgetRange: string;
  message?: string;
}
export interface IBookingEntity extends IBooking {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

/**
 * Zod schema for runtime validation of booking data
 */
export const bookingCreateSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
  phone: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a string",
    })
    .trim()
    .min(8, "Phone number is required")
    .max(20, "Phone number must be 20 characters or less"),
  email: z
    .string({ required_error: "Email is required", invalid_type_error: "Email must be a string" })
    .trim()
    .email("Invalid email address"),
  eventType: z
    .string({
      required_error: "Event type is required",
      invalid_type_error: "Event type must be a string",
    })
    .trim()
    .min(1, "Event type is required")
    .max(100, "Full name must be 100 characters or less"),
  eventDate: z
    .string({
      required_error: "Event date is required",
      invalid_type_error: "Event date must be a valid date",
    })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return selectedDate >= tomorrow;
      },
      { message: "Event date must be from tomorrow onwards" },
    ),
  budgetRange: z
    .string({
      required_error: "Budget range is required",
      invalid_type_error: "Budget range must be a string",
    })
    .trim()
    .min(1, "Budget range is required"),
  message: z
    .string({ invalid_type_error: "Message must be a string" })
    .trim()
    .max(1000, "Message must be 1000 characters or less")
    .optional(),
});

export type TBookingCreateInput = z.infer<typeof bookingCreateSchema>;

/**
 * Pagination result type for bookings
 */
export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});
