import { useMutation } from '@tanstack/react-query'

import { request } from '../base'

/** POST /api/auth/forgot-password. Always answers with a generic message. */
const forgotPassword = async ({ email }: { email: string }) => {
  return request<{ message: string }>({
    url: '/auth/forgot-password',
    method: 'POST',
    data: { email },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  })
}
