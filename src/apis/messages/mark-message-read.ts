import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../request'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TMessage } from '@/types/message'
import { getMessagesQueryKey } from './get-messages'

export const markMessageRead = async (
  requestId: number,
  messageId: number,
): Promise<TApiResponseSingle<TMessage>> => {
  return request<TApiResponseSingle<TMessage>>({
    url: `/requests/${requestId}/messages/${messageId}/read`,
    method: 'PATCH',
  })
}

export const useMarkMessageRead = (requestId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (messageId: number) => markMessageRead(requestId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getMessagesQueryKey(requestId) })
    },
  })
}
