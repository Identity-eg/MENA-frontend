import { describe, expect, it } from 'vitest'

import type {
  InvoiceStatusValue,
  RequestReportStatusValue,
  RequestStatusValue,
} from '@/types/request'
import { getNextStep, getRequestGroup } from './request-next-step'

const line = (status: RequestReportStatusValue, refundDueAt?: string) => ({
  status,
  refundDueAt: refundDueAt ?? null,
})

const req = (
  status: RequestStatusValue,
  {
    invoice,
    amount = 100,
    lines = [line('PENDING')],
  }: {
    invoice?: InvoiceStatusValue
    amount?: number
    lines?: Array<ReturnType<typeof line>>
  } = {},
) => ({
  status,
  invoice: invoice ? { status: invoice, amount } : null,
  requestReports: lines,
})

describe('getNextStep', () => {
  it('waits on review while under review', () => {
    expect(getNextStep(req('UNDER_REVIEW'))).toMatchObject({
      kind: 'review',
      actionable: false,
    })
  })

  it('asks for payment on an open invoice, flagging overdue', () => {
    expect(
      getNextStep(
        req('INVOICE_GENERATED', { invoice: 'PENDING', amount: 420 }),
      ),
    ).toEqual({ kind: 'pay', actionable: true, amount: 420, overdue: false })
    expect(
      getNextStep(req('INVOICE_GENERATED', { invoice: 'OVERDUE' })),
    ).toMatchObject({ kind: 'pay', overdue: true })
  })

  it('waits for a new invoice when the latest one was withdrawn', () => {
    expect(
      getNextStep(req('INVOICE_GENERATED', { invoice: 'CANCELLED' })),
    ).toMatchObject({ kind: 'invoice-pending', actionable: false })
  })

  it('counts delivered lines while in progress, ignoring rejected ones', () => {
    const lines = [
      line('DELIVERED'),
      line('PENDING'),
      line('REJECTED', '2026-01-01'),
    ]
    expect(getNextStep(req('PAID', { invoice: 'PAID', lines }))).toEqual({
      kind: 'in-progress',
      actionable: false,
      delivered: 1,
      total: 2,
    })
    expect(getNextStep(req('PROCESSING', { lines }))).toMatchObject({
      kind: 'in-progress',
    })
  })

  it('offers the Deliveries once completed', () => {
    expect(
      getNextStep(req('COMPLETED', { lines: [line('DELIVERED')] })),
    ).toEqual({ kind: 'download', actionable: true, delivered: 1 })
  })

  it('closes rejected and cancelled requests', () => {
    expect(getNextStep(req('REJECTED'))).toMatchObject({ kind: 'rejected' })
    expect(getNextStep(req('CANCELLED'))).toMatchObject({ kind: 'cancelled' })
  })
})

describe('getRequestGroup', () => {
  it('groups requests for the list tabs', () => {
    expect(
      getRequestGroup(req('INVOICE_GENERATED', { invoice: 'OVERDUE' })),
    ).toBe('needs-action')
    expect(
      getRequestGroup(req('INVOICE_GENERATED', { invoice: 'CANCELLED' })),
    ).toBe('in-progress')
    expect(getRequestGroup(req('UNDER_REVIEW'))).toBe('in-progress')
    expect(getRequestGroup(req('PROCESSING'))).toBe('in-progress')
    expect(getRequestGroup(req('COMPLETED'))).toBe('completed')
    expect(getRequestGroup(req('REJECTED'))).toBe('closed')
    expect(getRequestGroup(req('CANCELLED'))).toBe('closed')
  })
})
