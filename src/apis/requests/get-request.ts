import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TRequest } from '@/types/request'

type GetRequestData = TApiResponseSingle<TRequest>
type GetRequestQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetRequestData>>[0],
  'queryKey' | 'queryFn'
>

export const getRequest = async (requestId: number) => {
  const data = await request<GetRequestData>({
    url: `/requests/${requestId}`,
  })
  return data
}

export const getRequestQueryOptions = (
  requestId: number,
  options?: GetRequestQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['request', requestId],
    queryFn: () => getRequest(requestId),
    staleTime: 2 * 60 * 1000,
    ...options,
  })

export const useGetRequest = (
  requestId: number,
  options?: GetRequestQueryOptionsOverride,
) => useSuspenseQuery(getRequestQueryOptions(requestId, options))
