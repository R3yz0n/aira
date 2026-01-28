import { IStatsSummary } from "@/domain/common";
import type { IApiErrorResponse, IAxiosResponse, IErrorResponse } from "@/lib/types/api";
import axiosInstance from "./axios";

export const dashboardApi = {
  async getSummary(): Promise<IStatsSummary> {
    try {
      let { data }: IAxiosResponse<IStatsSummary> = await axiosInstance.get("/api/admin/summary");
      return data?.data as IStatsSummary;
    } catch (error) {
      const err = error as IApiErrorResponse;
      throw {
        message: err.error?.message || "Failed to fetch stats",
        status: err.status,
        details: err.error?.details,
      } satisfies IErrorResponse;
    }
  },
};
