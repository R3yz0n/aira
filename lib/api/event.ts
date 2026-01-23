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
      return (data?.data satisfies IPaginationResult<IEventEntity>) ?? []; // Return only the data array
    } catch (error) {
      const err = error as IApiErrorResponse;
      throw {
        message: err.error?.message || "Failed to fetch events",
        status: err.status,
        details: err.error?.details,
      } satisfies IErrorResponse;
    }
  },

  async create(formData: FormData): Promise<IEventEntity> {
    try {
      let { data }: IAxiosResponse<IEventEntity> = await axiosInstance.post(
        "/api/admin/events",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data?.data as IEventEntity;
    } catch (error) {
      const err = error as IApiErrorResponse;
      const status: number = err.status;
      let message: string = err.error?.message || "Create event failed";

      throw { message, status, details: err.error?.details } satisfies IErrorResponse;
    }
  },
};
