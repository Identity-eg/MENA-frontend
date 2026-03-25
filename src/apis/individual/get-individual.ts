import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TIndividual } from '@/types/individual'
import type { TApiResponseSingle } from '@/types/api-response-single'

type GetIndividualData = TApiResponseSingle<TIndividual>
type GetIndividualQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetIndividualData>>[0],
  'queryKey' | 'queryFn'
>

export const getIndividual = async (individualId: number) => {
  const data = await request<GetIndividualData>({
    url: `/individuals/${individualId}`,
  })
  return data
}

export const getIndividualQueryOptions = (
  individualId: number,
  options?: GetIndividualQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['individual', individualId],
    queryFn: () => getIndividual(individualId),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetIndividual = (
  individualId: number,
  options?: GetIndividualQueryOptionsOverride,
) => {
  return useSuspenseQuery(getIndividualQueryOptions(individualId, options))
}
