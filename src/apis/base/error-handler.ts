import type { AxiosError } from 'axios'

import type {
  TBackendErrorResponse,
  TFrontendErrorResponse,
} from './error-type'

export function getErrorMessage(error: AxiosError): TFrontendErrorResponse {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (error.response?.status === 500) {
    return {
      status: 500,
      message: 'Internal server error occurred.',
    }
  }

  const responseError = error.response?.data as TBackendErrorResponse | undefined

  if (responseError?.error) {
    return { status: error.response?.status, message: responseError.error }
  }
  
  if (responseError?.message) {
    const msg = Array.isArray(responseError.message) ? responseError.message[0] : responseError.message
    return { status: error.response?.status, message: msg }
  }

  if (error.message) {
    return { status: error.response?.status, message: error.message }
  }

  return {
    status: error.response?.status,
    message: 'An unknown error occurred.',
  }
}
