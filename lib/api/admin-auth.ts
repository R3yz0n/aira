import axiosInstance from "./axios";
import { isTokenExpired } from "@/lib/auth/jwt-client";
import type {
  IAdminLoginRequest,
  IAdminLoginResponse,
  IAxiosResponse,
  IApiErrorResponse,
  IErrorResponse,
} from "@/lib/types/api";

export const adminAuthApi = {
  async login(credentials: IAdminLoginRequest): Promise<IAdminLoginResponse> {
    try {
      let { data }: IAxiosResponse<IAdminLoginResponse> = await axiosInstance.post(
        "/api/admin/login",
        credentials
      );

      const token = data?.data.token;

      if (!token) {
        throw {
          message: "No token received from server",
          status: 500,
          details: null,
        } satisfies IErrorResponse;
      }

      return { token } satisfies IAdminLoginResponse;
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

  storeToken(token: string): void {
    window.localStorage.setItem("admin_token", token);
  },

  getToken(): string | null {
    return window.localStorage.getItem("admin_token");
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
