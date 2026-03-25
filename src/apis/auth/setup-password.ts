import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { request } from '../base'

const setupPassword = async ({
  password,
  token,
}: {
  password: string
  token: string
}) => {
  await request({
    url: '/auth/setup-password',
    method: 'POST',
    data: { password, token },
  })
}

export const useSetupPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: setupPassword,
    onSuccess: () => {
      navigate({ to: '/auth/login' })
    },
  })
}
