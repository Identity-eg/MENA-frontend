import { queryOptions, useQuery } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TPlanPurchase } from '@/types/credits'

type GetPlanPurchaseData = TApiResponseSingle<TPlanPurchase>

export const getPlanPurchase = async (id: number) => {
  return request<GetPlanPurchaseData>({ url: `/credits/purchases/${id}` })
}

/** Under `['credits']`, so a Grant refreshes it with the balance. */
export const getPlanPurchaseQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['credits', 'purchase', id],
    queryFn: () => getPlanPurchase(id),
    staleTime: 0,
  })

/** Polls every `pollMs` while `poll` is true: the checkout return page waits for the webhook this way. */
export const useGetPlanPurchase = (
  id: number,
  { poll, pollMs }: { poll: boolean; pollMs: number },
) =>
  useQuery({
    ...getPlanPurchaseQueryOptions(id),
    refetchInterval: poll ? pollMs : false,
    refetchIntervalInBackground: true,
  })
