import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TUnlock } from '@/types/unlock'
import type { TApiResponseSingle } from '@/types/api-response-single'

type GetUnlocksData = TApiResponseSingle<Array<TUnlock>>
type GetUnlocksQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetUnlocksData>>[0],
  'queryKey' | 'queryFn'
>

export const getUnlocks = async () => {
  const data = await request<GetUnlocksData>({
    url: '/unlocks',
  })
  return data
}

export const getUnlocksQueryOptions = (
  options?: GetUnlocksQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['unlocks'],
    queryFn: getUnlocks,
    staleTime: 2 * 60 * 1000,
    ...options,
  })

export const useGetUnlocks = (options?: GetUnlocksQueryOptionsOverride) => {
  return useSuspenseQuery(getUnlocksQueryOptions(options))
}
