export type TBackendErrorResponse = {
  code?: string
  error?: string
  message?: string | Array<string>
  details?: Record<string, unknown>
  retryAfter?: number
  statusCode?: number
}

export type TFrontendErrorResponse = {
  message: string
  status?: number
  /** Business error code from the backend (e.g. NOT_PAYABLE), when present. */
  code?: string
}
