import { queryOptions } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TFieldCost } from '@/types/credits'

type GetFieldCostsData = TApiResponseSingle<Array<TFieldCost>>

/** The Sensitive fields that can be Unlocked, with their Field cost, in display order. */
export const getFieldCosts = async () => {
  const data = await request<GetFieldCostsData>({ url: '/sensitive-fields' })
  return data
}

export const getFieldCostsQueryOptions = () =>
  queryOptions({
    queryKey: ['sensitive-fields'],
    queryFn: getFieldCosts,
    staleTime: 5 * 60 * 1000,
  })
