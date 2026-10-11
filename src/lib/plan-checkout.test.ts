import { describe, expect, it } from 'vitest'

import {
  CHECKOUT_POLL_INTERVAL_MS,
  CHECKOUT_TIMEOUT_MS,
  checkoutPollInterval,
  checkoutReturnState,
  checkoutReturnUrls,
  describePurchaseStatus,
  parseReturnTo,
} from './plan-checkout'

describe('parseReturnTo', () => {
  it('accepts a company page and the Credits page', () => {
    expect(parseReturnTo('/companies/42')).toEqual({
      kind: 'company',
      companyId: '42',
    })
    expect(parseReturnTo('/credits')).toEqual({ kind: 'credits' })
  })

  it('rejects anything else, so checkout can never send the user off-site', () => {
    for (const value of [
      undefined,
      '',
      'https://evil.test/companies/1',
      '//evil.test/companies/1',
      '/companies/abc',
      '/companies/1/../../admin',
      '/dashboard',
      42,
    ]) {
      expect(parseReturnTo(value)).toBeNull()
    }
  })
})

describe('checkoutReturnUrls', () => {
  it('returns to the checkout return page with the purchase placeholder and the return target', () => {
    const urls = checkoutReturnUrls('https://app.mena.test', {
      kind: 'company',
      companyId: '42',
    })
    const success = new URL(urls.successUrl)
    expect(success.origin + success.pathname).toBe(
      'https://app.mena.test/credits/checkout',
    )
    expect(success.searchParams.get('purchase')).toBe('{PLAN_PURCHASE_ID}')
    expect(success.searchParams.get('returnTo')).toBe('/companies/42')
    expect(success.searchParams.get('cancelled')).toBeNull()

    const cancel = new URL(urls.cancelUrl)
    expect(cancel.searchParams.get('purchase')).toBe('{PLAN_PURCHASE_ID}')
    expect(cancel.searchParams.get('cancelled')).toBe('true')
    expect(cancel.searchParams.get('returnTo')).toBe('/companies/42')
  })

  it('omits returnTo when checkout did not start from a company', () => {
    const urls = checkoutReturnUrls('http://localhost:3000', null)
    expect(new URL(urls.successUrl).searchParams.has('returnTo')).toBe(false)
  })
})

describe('checkoutReturnState', () => {
  it('waits while the purchase is pending, then gives up after the timeout', () => {
    expect(checkoutReturnState('PENDING', 0)).toBe('processing')
    expect(checkoutReturnState('PENDING', CHECKOUT_TIMEOUT_MS - 1)).toBe(
      'processing',
    )
    expect(checkoutReturnState('PENDING', CHECKOUT_TIMEOUT_MS)).toBe('timedOut')
  })

  it('settles as soon as the webhook decided, whatever the time', () => {
    expect(checkoutReturnState('PAID', CHECKOUT_TIMEOUT_MS * 2)).toBe('paid')
    expect(checkoutReturnState('FAILED', 10)).toBe('failed')
    expect(checkoutReturnState('EXPIRED', 10)).toBe('expired')
  })
})

describe('checkoutPollInterval', () => {
  it('polls while the purchase is unknown or pending, until the timeout', () => {
    expect(checkoutPollInterval(undefined, 0)).toBe(CHECKOUT_POLL_INTERVAL_MS)
    expect(checkoutPollInterval('PENDING', CHECKOUT_TIMEOUT_MS - 1)).toBe(
      CHECKOUT_POLL_INTERVAL_MS,
    )
    expect(checkoutPollInterval('PENDING', CHECKOUT_TIMEOUT_MS)).toBe(false)
  })

  it('stops as soon as the webhook decided the purchase', () => {
    expect(checkoutPollInterval('PAID', 0)).toBe(false)
    expect(checkoutPollInterval('FAILED', 0)).toBe(false)
    expect(checkoutPollInterval('EXPIRED', 0)).toBe(false)
  })
})

describe('describePurchaseStatus', () => {
  it('names each Plan purchase status for customers', () => {
    expect(describePurchaseStatus('PENDING').label).toBe('Processing')
    expect(describePurchaseStatus('PAID').label).toBe('Paid')
    expect(describePurchaseStatus('FAILED').label).toBe('Failed')
    expect(describePurchaseStatus('EXPIRED').label).toBe('Expired')
  })
})
