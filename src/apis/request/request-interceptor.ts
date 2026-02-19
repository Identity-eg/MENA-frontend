import { getCookie, setCookie } from '@tanstack/react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

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
    return getCookie('accessToken')
  })
  .client(() => {
    return useAuthStore.getState().accessToken
  })

export const setIsomorphicAccessToken = createIsomorphicFn()
  .server((data) => {
    setCookie('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 0.1 * 60 * 1000,
      path: '/',
    })
  })
  .client((data) => {
    useAuthStore.getState().setAccessToken(data.accessToken)
  })
