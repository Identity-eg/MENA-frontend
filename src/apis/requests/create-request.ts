import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TApiResponseSingle } from '@/types/api-response-single'
import type { CreateCompanyRequestPayload, TRequest } from '@/types/request'
import { request } from '../base'

type CreateRequestData = TApiResponseSingle<TRequest>

export const createRequest = async (payload: CreateCompanyRequestPayload) => {
  const data = await request<CreateRequestData>({
    url: '/requests',
    method: 'POST',
    data: payload,
  })
  return data
}

export const useCreateRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}
