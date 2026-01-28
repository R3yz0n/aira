import { IBookingEntity, IPaginationResult, TBookingCreateInput } from "@/domain/booking";
import axiosInstance from "./axios";
import type { IAxiosResponse, IApiErrorResponse, IErrorResponse } from "@/lib/types/api";

export const bookingApi = {
  async create(input: TBookingCreateInput): Promise<IBookingEntity> {
    try {
      const { data }: IAxiosResponse<IBookingEntity> = await axiosInstance.post(
        "/api/admin/bookings",
        input,
      );
      return data?.data as IBookingEntity;
    } catch (error) {
      const err = error as IApiErrorResponse;
      const status: number = err.status;
      const message: string = err.error?.message || "Create booking failed";

      throw { message, status, details: err.error?.details } satisfies IErrorResponse;
    }
  },
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<IPaginationResult<IBookingEntity>> {
    try {
      let { data }: IAxiosResponse<IPaginationResult<IBookingEntity>> = await axiosInstance.get(
        "/api/admin/bookings",
        { params },
      );
      return (data?.data satisfies IPaginationResult<IBookingEntity>) ?? []; // Return only the data array
    } catch (error) {
      const err = error as IApiErrorResponse;
      throw {
        message: err.error?.message || "Failed to fetch bookings",
        status: err.status,
        details: err.error?.details,
      } satisfies IErrorResponse;
    }
  },
};
