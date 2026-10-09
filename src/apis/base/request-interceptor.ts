import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie, getRequest, setCookie } from '@tanstack/react-start/server'
import type { InternalAxiosRequestConfig } from 'axios'

import { ACCESS_TOKEN_NAME } from '@/constants/auth'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import {
  isTransientRefreshFailure,
  refreshToken,
  type TRefreshTokenResult,
} from '../auth/refresh-token'

export const requestSuccessInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const accessToken = await getIsomorphicAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

export type TAccessTokenState = {
  accessToken: string | null
  /** True when there is a session but the refresh failed transiently (429/5xx/network). */
  authTransient: boolean
}

/**
 * One refresh per incoming SSR request. `setCookie` only affects the response, so
 * `getCookie` keeps returning no access token for the rest of the request; without
 * this every API call during SSR would refresh again (and spend the refresh rate limit).
 */
const refreshesByRequest = new WeakMap<Request, Promise<TRefreshTokenResult>>()

const refreshOncePerRequest = () => {
  const currentRequest = getRequest()
  let pending = refreshesByRequest.get(currentRequest)
  if (!pending) {
    pending = refreshToken()
    refreshesByRequest.set(currentRequest, pending)
  }
  return pending
}

export const getIsomorphicAccessTokenState = createIsomorphicFn()
  .server(async (): Promise<TAccessTokenState> => {
    const accessToken = getCookie(ACCESS_TOKEN_NAME) || null
    if (accessToken) return { accessToken, authTransient: false }

    const result = await refreshOncePerRequest()
    if (result.status === 'ok') {
      return { accessToken: result.accessToken, authTransient: false }
    }
    return {
      accessToken: null,
      authTransient: isTransientRefreshFailure(result),
    }
  })
  .client((): TAccessTokenState => {
    const context = getContext()
    const accessToken =
      context.queryClient.getQueryData<string>(['access-token']) ?? null
    return { accessToken, authTransient: false }
  })

export const getIsomorphicAccessToken = async () =>
  (await getIsomorphicAccessTokenState()).accessToken

export const setIsomorphicAccessToken = createIsomorphicFn()
  .server((data) => {
    const { accessCookieOptions } = getAuthCookieOptions()
    setCookie(ACCESS_TOKEN_NAME, data.accessToken, accessCookieOptions)
  })
  .client((data) => {
    const context = getContext()
    context.queryClient.setQueryData(['access-token'], data.accessToken)
  })
