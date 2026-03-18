import { getCookie, setCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import type { TUser } from '@/types/user'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import { getApiBaseUrl } from '@/apis/request/api-base-url'

export type AuthSession = {
  accessToken: string
  user: TUser
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie(REFRESH_TOKEN_NAME)
  if (!refreshToken) return null

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return null

    const data: { accessToken: string } = await res.json()
    if (!data.accessToken) return null

    const { accessCookieOptions } = getAuthCookieOptions()
    setCookie(ACCESS_TOKEN_NAME, data.accessToken, accessCookieOptions)
    return data.accessToken
  } catch {
    return null
  }
}

async function fetchUser(token: string): Promise<TUser | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null

    const data: { user: TUser } = await res.json()
    return data.user
  } catch {
    return null
  }
}

/**
 * Resolves the auth session server-side. Reads the access token cookie; if
 * missing, attempts a silent refresh using the refresh token cookie.
 * Returns a fully-resolved { accessToken, user } or null.
 *
 * Wrapped in createServerFn so the bundler isolates all server-only imports
 * (@tanstack/react-start/server) from the client bundle.
 */
export const resolveAuthSession = createServerFn().handler(
  async (): Promise<AuthSession | null> => {
    let accessToken = getCookie(ACCESS_TOKEN_NAME) ?? null

    if (!accessToken) {
      accessToken = await refreshAccessToken()
    }

    if (!accessToken) return null

    const user = await fetchUser(accessToken)
    if (!user) return null

    return { accessToken, user }
  },
)
