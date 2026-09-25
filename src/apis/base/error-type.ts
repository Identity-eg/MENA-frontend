export type TBackendErrorResponse = {
  code?: string
  error?: string
  message?: string | string[]
}

export type TFrontendErrorResponse = {
  message: string
  status?: number
}
