import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TRequest } from '@/types/request'

type GetRequestsData = TApiResponseSingle<Array<TRequest>>
type GetRequestsQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetRequestsData>>[0],
  'queryKey' | 'queryFn'
>

export type GetRequestsParams = {
  status?: string
  companyId?: number
}

export const getRequests = async (params?: GetRequestsParams) => {
  const data = await request<GetRequestsData>({
    url: '/requests',
    params: params as Record<string, string | number | undefined>,
  })
  return data
}

export const getRequestsQueryOptions = (
  params?: GetRequestsParams,
  options?: GetRequestsQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['requests', params?.status, params?.companyId],
    queryFn: () => getRequests(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  })

export const useGetRequests = (
  params?: GetRequestsParams,
  options?: GetRequestsQueryOptionsOverride,
) => useSuspenseQuery(getRequestsQueryOptions(params, options))
