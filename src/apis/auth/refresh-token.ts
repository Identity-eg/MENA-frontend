import { getCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { request } from '../request'
import { REFRESH_TOKEN_NAME } from '@/constants/auth'

export const refreshToken = createServerFn().handler(async () => {
  const existingRefreshToken = getCookie(REFRESH_TOKEN_NAME)

  if (!existingRefreshToken) {
    return null
  }

  const response = await request<{ accessToken: string }>({
    method: 'POST',
    data: {
      refreshToken: existingRefreshToken,
    },
    url: '/auth/refresh',
  })

  return response
})
