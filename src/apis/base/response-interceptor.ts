import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { getContext } from '@/integrations/tanstack-query/root-provider'
import { clearServerCredentials } from '@/lib/auth'
import { isTransientRefreshFailure, refreshToken } from '../auth/refresh-token'
import { apiClient } from './api-client'
import { getErrorMessage } from './error-handler'
import type { TFrontendErrorResponse } from './error-type'
import { setIsomorphicAccessToken } from './request-interceptor'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

const forceLogout = async () => {
  await clearServerCredentials()
  const context = getContext()
  context.queryClient.removeQueries({ queryKey: ['access-token'] })
  if (typeof window !== 'undefined') window.location.href = '/auth/login'
}

/** Returned when the refresh failed transiently (429/5xx/network): the session is kept. */
const TRANSIENT_AUTH_ERROR: TFrontendErrorResponse = {
  message:
    "We couldn't refresh your session right now. Please try again in a moment.",
}

export const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest =
    error.config as unknown as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          return apiClient(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const result = await refreshToken()

      if (result.status === 'ok') {
        const { accessToken } = result
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        setIsomorphicAccessToken({ accessToken })

        processQueue(null)
        return apiClient(originalRequest)
      }

      processQueue(error)
      if (isTransientRefreshFailure(result)) {
        // 429 / backend hiccup: the refresh token is still valid, so keep the session.
        return Promise.reject(TRANSIENT_AUTH_ERROR)
      }
      await forceLogout()
      return Promise.reject(error)
    } catch (refreshError) {
      // The refresh call itself failed (e.g. network): transient, do not log out.
      processQueue(refreshError as AxiosError)
      return Promise.reject(TRANSIENT_AUTH_ERROR)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(getErrorMessage(error))
}
