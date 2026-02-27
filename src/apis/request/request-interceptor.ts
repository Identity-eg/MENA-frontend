import { getCookie, setCookie } from '@tanstack/react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import { ACCESS_TOKEN_NAME } from '@/constants/auth'

export const requestSuccessInterceptor = (
  config: InternalAxiosRequestConfig,
) => {
  const accessToken = getIsomorphicAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export const getIsomorphicAccessToken = createIsomorphicFn()
  .server(() => {
    return getCookie(ACCESS_TOKEN_NAME)
  })
  .client(() => {
    return useAuthStore.getState().accessToken
  })

export const setIsomorphicAccessToken = createIsomorphicFn()
  .server((data) => {
    setCookie(
      ACCESS_TOKEN_NAME,
      data.accessToken,
      getAuthCookieOptions({ maxAge: 0.1 * 60 * 1000 }),
    )
  })
  .client((data) => {
    useAuthStore.getState().setAccessToken(data.accessToken)
  })
