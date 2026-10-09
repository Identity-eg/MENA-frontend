import { describe, expect, it } from 'vitest'

import { getErrorMessage } from '@/apis/base/error-handler'
import type { InvoiceStatusValue, RequestStatusValue } from '@/types/request'
import {
  canDownloadInvoice,
  getInvoiceDisplay,
  getLinePrice,
  isRequestPayable,
} from './request-billing'

const req = (
  status: RequestStatusValue,
  invoiceStatus?: InvoiceStatusValue,
  amount = 100,
) => ({
  status,
  invoice: invoiceStatus
    ? { id: 1, requestId: 1, amount, status: invoiceStatus }
    : null,
})

describe('isRequestPayable', () => {
  it('is payable only for INVOICE_GENERATED with a PENDING/OVERDUE invoice', () => {
    expect(isRequestPayable(req('INVOICE_GENERATED', 'PENDING'))).toBe(true)
    expect(isRequestPayable(req('INVOICE_GENERATED', 'OVERDUE'))).toBe(true)
    expect(isRequestPayable(req('INVOICE_GENERATED', 'CANCELLED'))).toBe(false)
    expect(isRequestPayable(req('INVOICE_GENERATED', 'PAID'))).toBe(false)
    expect(isRequestPayable(req('INVOICE_GENERATED'))).toBe(false)
    expect(isRequestPayable(req('CANCELLED', 'PENDING'))).toBe(false)
    expect(isRequestPayable(req('UNDER_REVIEW', 'CANCELLED'))).toBe(false)
  })
})

describe('getInvoiceDisplay', () => {
  it('labels withdrawn, paid and due invoices', () => {
    expect(getInvoiceDisplay(req('UNDER_REVIEW', 'CANCELLED')).kind).toBe(
      'withdrawn',
    )
    expect(getInvoiceDisplay(req('PAID', 'PAID', 50))).toEqual({
      kind: 'paid',
      amount: 50,
    })
    expect(getInvoiceDisplay(req('INVOICE_GENERATED', 'OVERDUE'))).toEqual({
      kind: 'due',
      amount: 100,
      overdue: true,
    })
    expect(getInvoiceDisplay(req('UNDER_REVIEW')).kind).toBe('none')
  })

  it('never offers a withdrawn invoice for download', () => {
    expect(canDownloadInvoice(req('REJECTED', 'CANCELLED'))).toBe(false)
    expect(canDownloadInvoice(req('PAID', 'PAID'))).toBe(true)
  })
})

describe('getLinePrice', () => {
  it('prefers the frozen finalPrice over the live estimate', () => {
    expect(
      getLinePrice({ finalPrice: 80, report: { estimatedPrice: 120 } }),
    ).toBe(80)
    expect(
      getLinePrice({ finalPrice: 0, report: { estimatedPrice: 120 } }),
    ).toBe(0)
    expect(
      getLinePrice({ finalPrice: null, report: { estimatedPrice: 120 } }),
    ).toBe(120)
  })
})

describe('getErrorMessage', () => {
  const axiosError = (status: number, data: unknown) => ({
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  })

  it('uses error for business errors', () => {
    expect(
      getErrorMessage(
        axiosError(409, {
          error: 'Request is not payable',
          code: 'NOT_PAYABLE',
        }),
      ),
    ).toEqual({
      status: 409,
      message: 'Request is not payable',
      code: 'NOT_PAYABLE',
    })
  })

  it('joins validation message arrays instead of showing "Bad Request"', () => {
    expect(
      getErrorMessage(
        axiosError(400, {
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request',
        }),
      ).message,
    ).toBe('email must be an email; password should not be empty')
    expect(
      getErrorMessage(
        axiosError(404, {
          statusCode: 404,
          message: 'Not found',
          error: 'Not Found',
        }),
      ).message,
    ).toBe('Not found')
  })

  it('falls back to error (429) and then to a fallback text', () => {
    expect(
      getErrorMessage(
        axiosError(429, { error: 'Too many requests', retryAfter: 30 }),
      ).message,
    ).toBe('Too many requests')
    expect(getErrorMessage(undefined, 'Oops').message).toBe('Oops')
  })

  it('passes through already-normalised errors', () => {
    expect(getErrorMessage({ message: 'Already done', status: 409 })).toEqual({
      message: 'Already done',
      status: 409,
    })
  })
})
