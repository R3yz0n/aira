import { IAdmin, IAuthToken, UserRole } from "@/domain/admin";
import axiosInstance from "./axios";
import { isTokenExpired } from "@/lib/auth/jwt-client";
import type { IAxiosResponse, IApiErrorResponse, IErrorResponse } from "@/lib/types/api";
import { get } from "lodash";

export const adminAuthApi = {
  async login(credentials: IAdmin): Promise<IAuthToken> {
    try {
      let { data }: IAxiosResponse<IAuthToken> = await axiosInstance.post(
        "/api/admin/login",
        credentials,
      );

      const token = data?.data.token;
      const role = data?.data.role;

      if (!token) {
        throw {
          message: "No token received from server",
          status: 500,
          details: null,
        } satisfies IErrorResponse;
      }

      return { token, role } satisfies IAuthToken;
    } catch (error) {
      const err = error as IApiErrorResponse;

      const status: number = err.status;
      let message: string;

      switch (status) {
        case 400:
          message = err.error?.message || "Invalid credentials provided";
          break;
        case 401:
          message = err.error?.message || "Invalid email or password";
          break;
        case 500:
          message = err.error?.message || "Server error occurred";
          break;
        default:
          message = err.error?.message || "Login failed";
      }

      throw { message, status, details: err.error?.details } satisfies IErrorResponse;
    }
  },

  storeToken(token: string, role: UserRole): void {
    window.localStorage.setItem("admin_token", token);
    window.localStorage.setItem("admin_role", role);
  },

  getToken(): string | null {
    return window.localStorage.getItem("admin_token");
  },
  getRole(): UserRole | null {
    const role = window.localStorage.getItem("admin_role");
    if (role === "admin" || role === "guest") {
      return role;
    }
    return null;
  },

  removeToken(): void {
    window.localStorage.removeItem("admin_token");
  },

  isTokenExpired(token: string): boolean {
    return isTokenExpired(token);
  },

  clearIfExpired(): void {
    const token = window.localStorage.getItem("admin_token");
    if (token && isTokenExpired(token)) {
      window.localStorage.removeItem("admin_token");
    }
  },
};
