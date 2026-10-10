import { useMutation } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type {ReturnTarget} from '@/lib/plan-checkout';
import {  checkoutReturnUrls } from '@/lib/plan-checkout'

export type TStartPlanCheckoutInput = {
  planId: number
  /** Where to land after paying: the company the user wanted to unlock, or the Credits page. */
  returnTo: ReturnTarget | null
}

type StartPlanCheckoutData = TApiResponseSingle<{
  url: string
  planPurchaseId: number
}>

/**
 * POST /api/credit-plans/:id/checkout. Opens a Stripe checkout at the plan's current price and
 * records a pending Plan purchase. Refusals: PLAN_INACTIVE, PLAN_NOT_FOUND.
 */
export const startPlanCheckout = async ({
  planId,
  returnTo,
}: TStartPlanCheckoutInput) => {
  return request<StartPlanCheckoutData>({
    url: `/credit-plans/${planId}/checkout`,
    method: 'POST',
    data: checkoutReturnUrls(window.location.origin, returnTo),
  })
}

/** Starts checkout and hands the page over to Stripe. */
export const useStartPlanCheckout = () =>
  useMutation({
    mutationFn: startPlanCheckout,
    onSuccess: ({ data }) => {
      window.location.assign(data.url)
    },
  })
