import { getCookie, setCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import { getApiBaseUrl } from '@/apis/request/api-base-url'

/**
 * Server fn called by the client-side Axios response interceptor when a
 * request gets a 401. Reads the refresh token cookie, exchanges it for a
 * new access token, sets the updated cookie, and returns the new token.
 */
export const refreshToken = createServerFn().handler(async () => {
  const existingRefreshToken = getCookie(REFRESH_TOKEN_NAME)
  if (!existingRefreshToken) return null

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: existingRefreshToken }),
    })
    if (!res.ok) return null

    const data: { accessToken: string } = await res.json()
    if (!data.accessToken) return null

    const { accessCookieOptions } = getAuthCookieOptions()
    setCookie(ACCESS_TOKEN_NAME, data.accessToken, accessCookieOptions)
    return { accessToken: data.accessToken }
  } catch {
    return null
  }
})
