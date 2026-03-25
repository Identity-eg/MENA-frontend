import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../base'
import type { TCompany } from '@/types/company'
import type { TApiResponseSingle } from '@/types/api-response-single'

type GetCompanyData = TApiResponseSingle<TCompany>
type GetCompanyQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetCompanyData>>[0],
  'queryKey' | 'queryFn'
>

export const getCompany = async (companyId: number) => {
  const data = await request<GetCompanyData>({
    url: `/companies/${companyId}`,
  })
  return data
}

export const getCompanyQueryOptions = (
  companyId: number,
  options?: GetCompanyQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['company', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetCompany = (
  companyId: number,
  options?: GetCompanyQueryOptionsOverride,
) => {
  return useSuspenseQuery(getCompanyQueryOptions(companyId, options))
}
