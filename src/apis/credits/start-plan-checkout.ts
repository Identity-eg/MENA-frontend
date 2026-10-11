import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { request } from '../base'
import { getCreditPlansQueryOptions } from './get-credit-plans'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { ReturnTarget } from '@/lib/plan-checkout'
import { checkoutReturnUrls } from '@/lib/plan-checkout'

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

/**
 * Buying a Credit plan from any plan list: starts checkout and hands the page over to Stripe.
 * A plan that went off sale meanwhile (PLAN_INACTIVE) refreshes the plan list so the current
 * catalog shows. `buyingPlanId` stays set after success too: the page is on its way to Stripe.
 */
export const usePlanCheckout = (returnTo: ReturnTarget | null) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: startPlanCheckout,
    onSuccess: ({ data }) => {
      window.location.assign(data.url)
    },
    onError: (error) => {
      if (error.code === 'PLAN_INACTIVE') {
        void queryClient.invalidateQueries({
          queryKey: getCreditPlansQueryOptions().queryKey,
        })
      }
    },
  })

  // Back from Stripe, the browser restores this page from its back/forward cache with the
  // mutation still marked successful; reset it so the Buy buttons work again.
  const { reset } = mutation
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset()
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [reset])

  return {
    buy: (planId: number) => mutation.mutate({ planId, returnTo }),
    buyingPlanId:
      (mutation.isPending || mutation.isSuccess) && mutation.variables
        ? mutation.variables.planId
        : null,
    /** null, or why checkout couldn't open; nothing was charged either way. */
    error: mutation.isError
      ? mutation.error.code === 'PLAN_INACTIVE'
        ? ('planInactive' as const)
        : ('failed' as const)
      : null,
  }
}
