import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import z from 'zod'
import { request } from '../base'
import { getAuthCookieOptions } from '@/lib/cookie-options'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'

const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await request<{
    accessToken: string
    message: string
    refreshToken: string
  }>({
    url: '/auth/login',
    method: 'POST',
    data: { email, password },
  })
}

const loginServerAction = createServerFn()
  .inputValidator(
    z.object({
      email: z.email('Please enter a valid work email.'),
      password: z.string().min(1, 'Password is required'),
    }),
  )
  .handler(async ({ data }) => {
    const { email, password } = data
    const response = await login({ email, password })

    const { accessCookieOptions, refreshCookieOptions } = getAuthCookieOptions()

    setCookie(ACCESS_TOKEN_NAME, response.accessToken, accessCookieOptions)
    setCookie(REFRESH_TOKEN_NAME, response.refreshToken, refreshCookieOptions)

    return { accessToken: response.accessToken, message: response.message }
  })

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginServerAction,
    onSuccess: (data) => {
      queryClient.clear()
      queryClient.setQueryData(['access-token'], data.accessToken)
      router.navigate({ to: '/dashboard' })
      router.invalidate()
    },
  })
}
