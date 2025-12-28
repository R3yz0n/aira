import { AdminLoginInput } from "@/domain/admin";
import { verifyPassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";
import { AdminRepository } from "@/repositories/admin-repository";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export interface IAuthServiceResult {
  token: string;
}

export class AdminAuthService {
  constructor(private adminRepository: AdminRepository) {}

  async login(input: AdminLoginInput): Promise<IAuthServiceResult> {
    const admin = await this.adminRepository.findByEmail(input.email);
    if (!admin) throw new InvalidCredentialsError();

    const match = await verifyPassword(input.password, admin.passwordHash);
    if (!match) throw new InvalidCredentialsError();

    const token = signToken({ sub: admin.id, email: admin.email });
    return { token };
  }
}
