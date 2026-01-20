import { IEventEntity } from "@/domain/event";
import axiosInstance from "./axios";
import type { IAxiosResponse, IApiErrorResponse, IErrorResponse } from "@/lib/types/api";
import { IPaginationResult } from "@/domain/event";

export const eventApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }): Promise<IPaginationResult<IEventEntity>> {
    try {
      let { data }: IAxiosResponse<IPaginationResult<IEventEntity>> = await axiosInstance.get(
        "/api/public/events",
        { params },
      );
      return data?.data ?? []; // Return only the data array
    } catch (error) {
      const err = error as IApiErrorResponse;
      throw {
        message: err.error?.message || "Failed to fetch events",
        status: err.status,
        details: err.error?.details,
      } satisfies IErrorResponse;
    }
  },
};
