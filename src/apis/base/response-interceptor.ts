import { refreshToken } from '../auth/refresh-token'
import { apiClient } from './api-client'
import { getErrorMessage } from './error-handler'
import { setIsomorphicAccessToken } from './request-interceptor'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { clearServerCredentials } from '@/lib/auth'
import { getContext } from '@/integrations/tanstack-query/root-provider'

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
  window.location.href = '/auth/login'
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
      const accessToken = await refreshToken()

      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        setIsomorphicAccessToken({ accessToken })

        processQueue(null)
        return apiClient(originalRequest)
      } else {
        processQueue(error)
        await forceLogout()
        return Promise.reject(error)
      }
    } catch (refreshError) {
      processQueue(refreshError as AxiosError)
      await forceLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(getErrorMessage(error))
}
