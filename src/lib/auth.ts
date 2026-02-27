import { createServerFn } from '@tanstack/react-start'
import { deleteCookie } from '@tanstack/react-start/server'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'

export const clearServerCredentials = createServerFn().handler(async () => {
  deleteCookie(REFRESH_TOKEN_NAME)
  deleteCookie(ACCESS_TOKEN_NAME)
})
