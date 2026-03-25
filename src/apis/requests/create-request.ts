import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../base'
import type { CreateCompanyRequestPayload, TRequest } from '@/types/request'
import type { TApiResponseSingle } from '@/types/api-response-single'

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
