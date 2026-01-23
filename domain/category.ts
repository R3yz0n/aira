import { z } from "zod";

export interface ICategory {
  name: string;
  description: string;
}
export interface ICategoryEntity extends ICategory {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  totalEvents?: number;
}

export type TCategoryWithStats = Pick<ICategoryEntity, "id" | "name" | "description"> & {
  totalEvents: number;
};

// export type IAdmin = z.infer<typeof adminLoginSchema>;

export const categoryCreateSchema = z.object({
  name: z
    .string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
});

export const categoryUpdateSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
});

export const categoryIdSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
});

export type TCategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type TCategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
