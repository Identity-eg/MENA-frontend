import '@tanstack/react-query'
import type { TFrontendErrorResponse } from '@/apis/base/error-type'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: TFrontendErrorResponse
  }
}
