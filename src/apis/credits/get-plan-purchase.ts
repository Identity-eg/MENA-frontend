import { queryOptions, useQuery } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TPlanPurchase } from '@/types/credits'
import { checkoutPollInterval } from '@/lib/plan-checkout'

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

/**
 * Polls the purchase until the webhook decides it, or for CHECKOUT_TIMEOUT_MS from `startedAt`
 * (the checkout return page waits for Stripe this way). Elapsed time is measured to the last
 * response, so the page's timed-out state and the end of polling always agree.
 */
export const useGetPlanPurchase = (
  id: number,
  { startedAt }: { startedAt: number },
) =>
  useQuery({
    ...getPlanPurchaseQueryOptions(id),
    refetchInterval: (query) =>
      checkoutPollInterval(
        query.state.data?.data.status,
        Math.max(query.state.dataUpdatedAt, query.state.errorUpdatedAt) -
          startedAt,
      ),
    refetchIntervalInBackground: true,
  })
