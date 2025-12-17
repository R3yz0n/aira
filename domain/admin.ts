import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
}
