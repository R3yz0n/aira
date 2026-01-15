import { z } from "zod";

export interface IEvent {
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  categoryId: string;
}

export interface IEventEntity extends IEvent {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  publicId: string;
}

export const eventCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required", invalid_type_error: "Title must be a string" })
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  categoryId: z
    .string({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a string",
    })
    .trim()
    .min(1, "Category ID is required"),
});

// Schema for image file validation (type and size)
export const imageFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif,application/octet-stream",
        ].includes(file.type),
      "Invalid file type. Allowed: JPG, PNG, WebP, GIF"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size too large. Maximum 5MB allowed"),
});

// Schema for image URL validation
export const imageUrlSchema = z.object({
  imageUrl: z
    .string({
      required_error: "Image URL is required",
      invalid_type_error: "Image URL must be a string",
    })
    .trim()
    .url("Image URL must be a valid URL")
    .min(1, "Image URL is required"),
});

export const eventUpdateSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  imageUrl: z
    .string({ invalid_type_error: "Image URL must be a string" })
    .trim()
    .url("Image URL must be a valid URL")
    .min(1, "Image URL is required"),
  categoryId: z
    .string({ invalid_type_error: "Category ID must be a string" })
    .trim()
    .min(1, "Category ID is required"),
});

export const eventIdSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
export type ImageFileInput = z.infer<typeof imageFileSchema>;
export type ImageUrlInput = z.infer<typeof imageUrlSchema>;
