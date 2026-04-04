import { getCookie, setCookie } from '@tanstack/react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'
import { refreshToken } from '../auth/refresh-token'
import type { InternalAxiosRequestConfig } from 'axios'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import { ACCESS_TOKEN_NAME } from '@/constants/auth'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const requestSuccessInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const accessToken = await getIsomorphicAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export const getIsomorphicAccessToken = createIsomorphicFn()
  .server(async () => {
    let accessToken = getCookie(ACCESS_TOKEN_NAME) || null

    if (!accessToken) {
      accessToken = await refreshToken()
    }

    return accessToken
  })
  .client(() => {
    const context = getContext()
    return context.queryClient.getQueryData(['access-token'])
  })

export const setIsomorphicAccessToken = createIsomorphicFn()
  .server((data) => {
    const { accessCookieOptions } = getAuthCookieOptions()
    setCookie(ACCESS_TOKEN_NAME, data.accessToken, accessCookieOptions)
  })
  .client((data) => {
    const context = getContext()
    context.queryClient.setQueryData(['access-token'], data.accessToken)
  })
