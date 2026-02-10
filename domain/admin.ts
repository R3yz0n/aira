import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type IAdmin = z.infer<typeof adminLoginSchema>;

export type UserRole = "admin" | "guest";

export interface IAdminEntity extends IAdmin {
  id: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface IAuthToken {
  token: string;
}
