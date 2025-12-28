import { z } from "zod";

export const adminLoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .refine(
    (data) => {
      // Password cannot contain the email username
      const emailUsername = data.email.split("@")[0];
      return !data.password.toLowerCase().includes(emailUsername.toLowerCase());
    },
    {
      message: "Password cannot contain your email username",
    }
  );

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export interface IAdmin {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
}
