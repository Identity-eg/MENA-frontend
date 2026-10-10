import { queryOptions } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TCreditPlan } from '@/types/credits'

type GetCreditPlansData = TApiResponseSingle<Array<TCreditPlan>>

/** Active Credit plans in the order the admin set. */
export const getCreditPlans = async () => {
  const data = await request<GetCreditPlansData>({ url: '/credit-plans' })
  return data
}

export const getCreditPlansQueryOptions = () =>
  queryOptions({
    queryKey: ['credit-plans'],
    queryFn: getCreditPlans,
    staleTime: 5 * 60 * 1000,
  })
