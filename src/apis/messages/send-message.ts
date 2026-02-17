import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../request'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TMessage } from '@/types/message'
import { getMessagesQueryKey } from './get-messages'

export const sendMessage = async (
  requestId: number,
  content: string,
): Promise<TApiResponseSingle<TMessage>> => {
  return request<TApiResponseSingle<TMessage>>({
    url: `/requests/${requestId}/messages`,
    method: 'POST',
    data: { content: content.trim() },
  })
}

export const useSendMessage = (requestId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => sendMessage(requestId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getMessagesQueryKey(requestId) })
    },
  })
}
