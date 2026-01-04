import { z } from "zod";

export interface ICategory {
  id: string;
  name: string;
  description: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
});

export const categoryUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).max(500).optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().trim().min(1),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
