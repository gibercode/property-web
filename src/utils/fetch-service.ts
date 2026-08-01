import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | string[]) {
    super(Array.isArray(message) ? message.join(", ") : message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

type FetchServiceOptions = AxiosRequestConfig & {
  token?: string | null;
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.statusCode === "number" &&
    (typeof candidate.message === "string" || Array.isArray(candidate.message))
  );
};

const toApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status ?? 500;
    const data: unknown = error.response?.data;

    if (isApiErrorResponse(data)) {
      return new ApiError(data.statusCode, data.message);
    }

    return new ApiError(statusCode, "No se pudo completar la solicitud");
  }

  if (error instanceof Error) {
    return new ApiError(500, error.message);
  }

  return new ApiError(500, "No se pudo completar la solicitud");
};

export const fetchService = {
  async request<T>(url: string, options: FetchServiceOptions = {}) {
    const { headers, token, ...config } = options;

    try {
      const { data } = await axiosClient.request<T>({
        url,
        ...config,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      });

      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },
};
