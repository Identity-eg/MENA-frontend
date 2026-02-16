import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

export const requestSuccessInterceptor = (
  config: InternalAxiosRequestConfig,
) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    console.log({ accessToken })
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}
