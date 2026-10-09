import type { AxiosError } from 'axios'

import type {
  TBackendErrorResponse,
  TFrontendErrorResponse,
} from './error-type'

const FALLBACK_MESSAGE = 'An unknown error occurred.'

/**
 * Message from a backend error body (contract rule):
 * 1. business error `{ code, error }` -> `error`
 * 2. Nest error `{ message: string | string[] }` -> message (arrays joined with '; ')
 * 3. `{ error }` (e.g. 429 `{ error, retryAfter }`) -> `error`
 * Returns null when the body carries no usable message.
 */
export function extractBackendErrorMessage(data: unknown): string | null {
  if (data == null || typeof data !== 'object') return null
  const body = data as TBackendErrorResponse

  if (body.code && body.error) return body.error
  if (Array.isArray(body.message)) {
    const parts = body.message.filter(Boolean)
    if (parts.length > 0) return parts.join('; ')
  } else if (body.message) {
    return body.message
  }
  if (body.error) return body.error
  return null
}

/**
 * Normalises any thrown API error into `{ message, status?, code? }`.
 * Accepts an AxiosError, an already-normalised `TFrontendErrorResponse`
 * (what the response interceptor rejects with), an Error, or a string.
 */
export function getErrorMessage(
  error: AxiosError | TFrontendErrorResponse | Error | string | unknown,
  fallback: string = FALLBACK_MESSAGE,
): TFrontendErrorResponse {
  if (typeof error === 'string') {
    return { message: error || fallback }
  }
  if (error == null || typeof error !== 'object') {
    return { message: fallback }
  }

  const candidate = error as Partial<AxiosError> &
    Partial<TFrontendErrorResponse>
  const response = candidate.response
  const status = response?.status ?? candidate.status

  const fromBody = extractBackendErrorMessage(response?.data)
  if (fromBody) {
    const code = (response?.data as TBackendErrorResponse | undefined)?.code
    return { status, message: fromBody, ...(code && { code }) }
  }

  if (!response && candidate.message) {
    // Already normalised by the response interceptor (keeps its business code),
    // or a plain Error / network AxiosError (whose `code` is not a backend code).
    const code = candidate.isAxiosError ? undefined : candidate.code
    return { status, message: candidate.message, ...(code && { code }) }
  }

  if (status === 500) {
    return { status, message: 'Internal server error occurred.' }
  }

  return { status, message: candidate.message || fallback }
}
