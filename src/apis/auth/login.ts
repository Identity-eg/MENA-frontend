import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { request } from '../request'
import { setServerCredentials, useSetClientAccessToken } from '@/lib/auth'

const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await request<{ accessToken: string; message: string }>({
    url: '/auth/login',
    method: 'POST',
    data: { email, password },
  })
}

export const useLogin = () => {
  const setAccessToken = useSetClientAccessToken()
  const router = useRouter()

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken)
      await setServerCredentials({ data: { accessToken: data.accessToken } })
      router.navigate({ to: '/' })
      router.invalidate()
    },
  })
}
