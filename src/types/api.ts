export type ApiResponse<T> = {
  response: T
}

export type ApiErrorResponse = {
  statusCode: number
  message: string | string[]
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}
