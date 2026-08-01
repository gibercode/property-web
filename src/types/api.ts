export type ApiResponse<T> = {
  response: T
}

export type ApiErrorResponse = {
  statusCode: number
  message: string | string[]
}
