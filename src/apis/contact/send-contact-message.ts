import { useMutation } from '@tanstack/react-query'
import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'

export type ContactMessagePayload = {
  fullName: string
  email: string
  companyName: string
  jurisdiction: string
  interest: string
  message?: string
  consent: boolean
}

export const sendContactMessage = async (
  payload: ContactMessagePayload,
): Promise<TApiResponseSingle<{ id: number }>> => {
  return request<TApiResponseSingle<{ id: number }>>({
    url: '/contact',
    method: 'POST',
    data: payload,
  })
}

export const useSendContactMessage = () => {
  return useMutation({
    mutationFn: sendContactMessage,
  })
}
