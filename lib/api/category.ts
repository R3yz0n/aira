import { TCategoryCreateInput, TCategoryUpdateInput, ICategoryEntity } from "@/domain/category";
import axiosInstance from "./axios";
import type { IAxiosResponse, IApiErrorResponse, IErrorResponse } from "@/lib/types/api";

export const categoryApi = {
  async list(): Promise<ICategoryEntity[]> {
    try {
      let { data }: IAxiosResponse<ICategoryEntity[]> = await axiosInstance.get(
        "/api/public/categories"
      );
      return data?.data as ICategoryEntity[];
    } catch (error) {
      const err = error as IApiErrorResponse;
      throw {
        message: err.error?.message || "Failed to fetch categories",
        status: err.status,
        details: err.error?.details,
      } satisfies IErrorResponse;
    }
  },

  async create(input: TCategoryCreateInput): Promise<ICategoryEntity> {
    try {
      let { data }: IAxiosResponse<ICategoryEntity> = await axiosInstance.post(
        "/api/admin/categories",
        input
      );
      return data?.data as ICategoryEntity;
    } catch (error) {
      const err = error as IApiErrorResponse;
      const status: number = err.status;
      let message: string = err.error?.message || "Create category failed";

      // surface validation errors / duplicate resource
      throw { message, status, details: err.error?.details } satisfies IErrorResponse;
    }
  },

  async update(id: string, input: TCategoryUpdateInput): Promise<ICategoryEntity> {
    try {
      let { data }: IAxiosResponse<ICategoryEntity> = await axiosInstance.put(
        `/api/admin/categories/${id}`,
        input
      );
      return data?.data as ICategoryEntity;
    } catch (error) {
      const err = error as IApiErrorResponse;
      const status: number = err.status;
      let message: string = err.error?.message || "Update category failed";

      // surface validation errors / duplicate resource / not found
      throw { message, status, details: err.error?.details } satisfies IErrorResponse;
    }
  },
};
