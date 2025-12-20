import { AxiosResponse } from "axios";

export interface IApiSuccessResponse<T> {
  success: true;
  data: T;
  status: number;
}

export interface IApiErrorResponse {
  success: false;
  status: number;
  error: {
    code: string;
    message: string;
    details: IValidationError | string | object | null;
  };
}

// Matches Zod's flatten() output
export interface IValidationError {
  formErrors?: string[];
  fieldErrors: IFieldErrors;
}

export interface IFieldErrors {
  [key: string]: string[];
}
export interface IErrorResponse {
  message: string;
  status: number;
  details: unknown;
}

// Admin Auth Specific
export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IAdminLoginResponse {
  token: string;
}

export type IAxiosResponse<T = object> = AxiosResponse<IApiSuccessResponse<T>>;
