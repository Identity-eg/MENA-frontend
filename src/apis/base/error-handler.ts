import type { AxiosError } from 'axios'
import type {
  TBackendErrorResponse,
  TFrontendErrorResponse,
} from './error-type'

export function getErrorMessage(error: AxiosError): TFrontendErrorResponse {
  if (typeof error === 'string') {
    return error
  }

  if (error.response?.status === 500) {
    return {
      status: 500,
      message: 'Internal server error occurred.',
    }
  }

  const responseError = error.response?.data as TBackendErrorResponse

  if (responseError.error) {
    return { status: error.response?.status, message: responseError.error }
  }

  return {
    status: error.response?.status,
    message: 'An unknown error occurred.',
  }
}
