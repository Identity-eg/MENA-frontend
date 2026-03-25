import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TIndividual } from '@/types/individual'
import type { TApiResponsePaginated } from '@/types/api-response-paginated'

type GetIndividualsData = TApiResponsePaginated<TIndividual>
type GetIndividualsQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetIndividualsData>>[0],
  'queryKey' | 'queryFn'
>

export type GetIndividualsParams = {
  q?: string
  limit?: number
  offset?: number
}

export const getIndividuals = async ({
  q,
  limit = 50,
  offset = 0,
}: GetIndividualsParams) => {
  const data = await request<TApiResponsePaginated<TIndividual>>({
    url: '/individuals/search',
    params: {
      q,
      limit,
      offset,
    },
  })
  return data
}

export const getIndividualsQueryOptions = (
  params: GetIndividualsParams,
  options?: GetIndividualsQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['individuals', params.q, params.limit, params.offset],
    queryFn: () => getIndividuals(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetIndividuals = (
  params: GetIndividualsParams,
  options?: GetIndividualsQueryOptionsOverride,
) => {
  return useSuspenseQuery(getIndividualsQueryOptions(params, options))
}
