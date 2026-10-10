import type { TPlanPurchaseStatus } from '@/types/credits'

/**
 * Where the user goes back to after buying a Credit plan. Only pages inside the app that a
 * purchase can start from are accepted, so a crafted link can never send the user off-site.
 */
export type ReturnTarget =
  { kind: 'company'; companyId: string } | { kind: 'credits' }

/** The path a ReturnTarget stands for, as carried in `returnTo` search params. */
export function returnToPath(target: ReturnTarget): string {
  return target.kind === 'company'
    ? `/companies/${target.companyId}`
    : '/credits'
}

/** Reads a `returnTo` search param; anything that isn't a known in-app page is dropped. */
export function parseReturnTo(value: unknown): ReturnTarget | null {
  if (typeof value !== 'string') return null
  if (value === '/credits') return { kind: 'credits' }
  const company = /^\/companies\/(\d+)$/.exec(value)
  return company ? { kind: 'company', companyId: company[1] } : null
}

/** Replaced by the server with the new Plan purchase's id. */
const PURCHASE_PLACEHOLDER = '{PLAN_PURCHASE_ID}'

/** The checkout return page, relative to the app's origin. */
export const CHECKOUT_RETURN_PATH = '/credits/checkout'

/** Where Stripe sends the user back after paying or cancelling. */
export function checkoutReturnUrls(
  origin: string,
  returnTo: ReturnTarget | null,
): { successUrl: string; cancelUrl: string } {
  const build = (cancelled: boolean) => {
    const url = new URL(CHECKOUT_RETURN_PATH, origin)
    url.searchParams.set('purchase', PURCHASE_PLACEHOLDER)
    if (cancelled) url.searchParams.set('cancelled', 'true')
    if (returnTo) url.searchParams.set('returnTo', returnToPath(returnTo))
    return url.toString()
  }
  return { successUrl: build(false), cancelUrl: build(true) }
}

/** How often the return page asks whether the payment was confirmed. */
export const CHECKOUT_POLL_INTERVAL_MS = 2000
/** How long the return page waits for Stripe's confirmation before pointing to the Credits page. */
export const CHECKOUT_TIMEOUT_MS = 60_000

export type CheckoutReturnState =
  'processing' | 'paid' | 'failed' | 'expired' | 'timedOut'

/** What the checkout return page shows for a Plan purchase status after waiting `elapsedMs`. */
export function checkoutReturnState(
  status: TPlanPurchaseStatus,
  elapsedMs: number,
): CheckoutReturnState {
  switch (status) {
    case 'PAID':
      return 'paid'
    case 'FAILED':
      return 'failed'
    case 'EXPIRED':
      return 'expired'
    case 'PENDING':
      return elapsedMs >= CHECKOUT_TIMEOUT_MS ? 'timedOut' : 'processing'
  }
}

export type PurchaseStatusDisplay = {
  label: string
  tone: 'pending' | 'success' | 'failure' | 'muted'
}

/** A Plan purchase status as customers read it. */
export function describePurchaseStatus(
  status: TPlanPurchaseStatus,
): PurchaseStatusDisplay {
  switch (status) {
    case 'PENDING':
      return { label: 'Processing', tone: 'pending' }
    case 'PAID':
      return { label: 'Paid', tone: 'success' }
    case 'FAILED':
      return { label: 'Failed', tone: 'failure' }
    case 'EXPIRED':
      return { label: 'Expired', tone: 'muted' }
  }
}
