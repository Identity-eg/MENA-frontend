import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { request } from '../base'
import type { TPagePagination, TPlanPurchase } from '@/types/credits'

export type GetPlanPurchasesData = {
  success: boolean
  data: Array<TPlanPurchase>
  pagination: TPagePagination
}

export type PlanPurchasesParams = { page: number; pageSize: number }

export const getPlanPurchases = async (params: PlanPurchasesParams) => {
  return request<GetPlanPurchasesData>({ url: '/credits/purchases', params })
}

/** Under `['credits']`, so a Grant refreshes the list with the balance. */
export const getPlanPurchasesQueryOptions = (params: PlanPurchasesParams) =>
  queryOptions({
    queryKey: ['credits', 'purchases', params],
    queryFn: () => getPlanPurchases(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })

export const useGetPlanPurchases = (params: PlanPurchasesParams) =>
  useQuery(getPlanPurchasesQueryOptions(params))
