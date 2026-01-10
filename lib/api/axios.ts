import axios, { AxiosError, type AxiosResponse } from "axios";
import { isTokenExpired } from "../auth/jwt-client";
import { IApiErrorResponse, IApiSuccessResponse, IAxiosResponse } from "../types/api";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip token injection for login endpoint
    if (config.url?.includes("/api/admin/login")) {
      return config;
    }
    if (config?.url?.includes("/api/public/")) {
      return config;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    if (token) {
      if (isTokenExpired(token)) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
          window.location.href = "/login";
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    response.data = {
      data: response.data.data,
      success: response.data.success ?? true,
      status: response.status,
    } satisfies IApiSuccessResponse<object>;
    return response satisfies IAxiosResponse;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        // Only redirect to login if we're on an admin route
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/login";
        }
      }
    }

    const respData = error.response?.data || {};
    let axiosError: IApiErrorResponse = {
      success: respData.success || false,
      error: {
        code: respData?.error?.code || "UNKNOWN_ERROR",
        message: respData?.error?.message || respData?.message || "An unexpected error occurred",
        details: respData?.error?.details || null,
      },

      status: error.response?.status || error.status || 500,
    };

    return Promise.reject(axiosError) as Promise<IApiErrorResponse>;
  }
);

export default axiosInstance;
