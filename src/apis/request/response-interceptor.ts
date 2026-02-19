// import { refreshAccessTokenAction } from '../auth/refresh-access-token'
import { refreshToken } from '../auth/refresh-token'
import { apiClient } from './api-client'
import { getErrorMessage } from './error-handler'
import { setIsomorphicAccessToken } from './request-interceptor'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

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
      const refreshResponse = await refreshToken()

      if (refreshResponse?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`
        setIsomorphicAccessToken({ accessToken: refreshResponse.accessToken })

        processQueue(null)
        return apiClient(originalRequest)
      } else {
        processQueue(error)
        return Promise.reject(error)
      }
    } catch (refreshError) {
      processQueue(error)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(getErrorMessage(error))
}
