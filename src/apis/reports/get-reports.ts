import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TReport } from '@/types/report'
import type { TApiResponseSingle } from '@/types/api-response-single'

type GetReportsData = TApiResponseSingle<Array<TReport>>
type GetReportsQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetReportsData>>[0],
  'queryKey' | 'queryFn'
>

export type GetReportsParams = {
  isActive?: boolean
  countryCode?: string
}

export const getReports = async (params?: GetReportsParams) => {
  const data = await request<GetReportsData>({
    url: '/reports',
    params,
  })
  return data
}

export const getReportsQueryOptions = (
  params?: GetReportsParams,
  options?: GetReportsQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['reports', params?.isActive, params?.countryCode],
    queryFn: () => getReports(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetReports = (
  params?: GetReportsParams,
  options?: GetReportsQueryOptionsOverride,
) => {
  return useSuspenseQuery(getReportsQueryOptions(params, options))
}
