import { createServerFn } from '@tanstack/react-start'
import { deleteCookie } from '@tanstack/react-start/server'

export const clearServerCredentials = createServerFn().handler(async () => {
  deleteCookie('refreshToken')
  deleteCookie('accessToken')
})
