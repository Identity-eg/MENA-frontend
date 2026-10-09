import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

import { getApiBaseUrl } from '@/apis/base/api-base-url'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'
import { getClientIpHeaders } from '@/lib/client-ip'
import { getAuthCookieOptions } from '@/lib/cookie-options'

/**
 * Outcome of a token refresh.
 * - `ok`: a new access token was issued (and the access cookie set).
 * - `unauthenticated`: no refresh cookie, or the backend rejected it. The session is over.
 * - `rate_limited` / `unavailable`: TRANSIENT (429, 5xx, network). The session is still
 *   valid; callers must NOT clear credentials or force a logout.
 */
export type TRefreshTokenResult =
  | { status: 'ok'; accessToken: string }
  | { status: 'unauthenticated' }
  | { status: 'rate_limited'; retryAfter?: number }
  | { status: 'unavailable' }

export const isTransientRefreshFailure = (result: TRefreshTokenResult) =>
  result.status === 'rate_limited' || result.status === 'unavailable'

export const refreshToken = createServerFn().handler(
  async (): Promise<TRefreshTokenResult> => {
    const existingRefreshToken = getCookie(REFRESH_TOKEN_NAME)
    if (!existingRefreshToken) return { status: 'unauthenticated' }

    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getClientIpHeaders(),
        },
        body: JSON.stringify({ refreshToken: existingRefreshToken }),
      })

      if (res.status === 429) {
        const body = (await res.json().catch(() => null)) as {
          retryAfter?: number
        } | null
        return { status: 'rate_limited', retryAfter: body?.retryAfter }
      }
      if (res.status >= 500) return { status: 'unavailable' }
      if (!res.ok) return { status: 'unauthenticated' }

      const data: { accessToken?: string } = await res.json()
      if (!data.accessToken) return { status: 'unauthenticated' }

      const { accessCookieOptions } = getAuthCookieOptions()
      setCookie(ACCESS_TOKEN_NAME, data.accessToken, accessCookieOptions)

      return { status: 'ok', accessToken: data.accessToken }
    } catch {
      return { status: 'unavailable' }
    }
  },
)
