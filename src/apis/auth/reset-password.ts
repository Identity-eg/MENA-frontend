import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { request } from '../base'

/** POST /api/auth/reset-password. 400 for a bad/expired token or a weak password. */
const resetPassword = async ({
  password,
  token,
}: {
  password: string
  token: string
}) => {
  return request<{ message: string }>({
    url: '/auth/reset-password',
    method: 'POST',
    data: { password, token },
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Your password has been reset. Please sign in.')
      navigate({ to: '/auth/login' })
    },
  })
}
