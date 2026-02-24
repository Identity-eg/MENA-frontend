import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { request } from '../request'

type RegisterPayload = {
  email: string
  name: string
  companyName: string
  roleInCompany?: string
  phone: string
}

const register = async (payload: RegisterPayload) => {
  await request<{ accessToken: string }>({
    url: '/auth/register',
    method: 'POST',
    data: payload,
  })
}

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate({ to: '/auth/pending-verification' })
    },
  })
}
