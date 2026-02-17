import { queryOptions, useQuery } from '@tanstack/react-query'
import { request } from '../request'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TMessage } from '@/types/message'

type GetMessagesData = TApiResponseSingle<TMessage[]>

export const getMessages = async (requestId: number) => {
  const data = await request<GetMessagesData>({
    url: `/requests/${requestId}/messages`,
  })
  return data
}

export const getMessagesQueryKey = (requestId: number) =>
  ['messages', requestId] as const

export const getMessagesQueryOptions = (requestId: number) =>
  queryOptions({
    queryKey: getMessagesQueryKey(requestId),
    queryFn: () => getMessages(requestId),
    staleTime: 30 * 1000,
  })

export const useGetMessages = (requestId: number, options?: { enabled?: boolean }) =>
  useQuery({
    ...getMessagesQueryOptions(requestId),
    enabled: options?.enabled !== false && requestId > 0,
  })
