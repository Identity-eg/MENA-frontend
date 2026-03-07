import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../request'
import type { TCompany } from '@/types/company'
import type { TApiResponsePaginated } from '@/types/api-response-paginated'

type GetCompaniesData = TApiResponsePaginated<TCompany>
type GetCompaniesQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetCompaniesData>>[0],
  'queryKey' | 'queryFn'
>

export type GetCompaniesParams = {
  q?: string
  limit?: number
  offset?: number
  industry?: string
  country?: string
  mode?: 'hybrid' | 'fuzzy' | 'vector'
}

export const getCompanies = async ({
  q,
  limit = 50,
  offset = 0,
  industry,
  country,
  mode,
}: GetCompaniesParams) => {
  const data = await request<TApiResponsePaginated<TCompany>>({
    url: '/companies/search',
    params: {
      q,
      limit,
      offset,
      industry,
      country,
      mode,
    },
  })
  return data
}

export const getCompaniesQueryOptions = (
  params: GetCompaniesParams,
  options?: GetCompaniesQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: [
      'companies',
      params.q,
      params.limit,
      params.offset,
      params.industry,
      params.country,
      params.mode,
    ],
    queryFn: () => getCompanies(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetCompanies = (
  params: GetCompaniesParams,
  options?: GetCompaniesQueryOptionsOverride,
) => {
  return useSuspenseQuery(getCompaniesQueryOptions(params, options))
}
