import { describe, expect, it } from 'vitest'

import { buildRequestTimeline } from './request-timeline'

const states = (steps: ReturnType<typeof buildRequestTimeline>) =>
  steps.map((s) => `${s.label}:${s.state}`)

describe('buildRequestTimeline', () => {
  it('marks earlier steps done and the current one current', () => {
    expect(states(buildRequestTimeline({ status: 'PAID' }))).toEqual([
      'Under review:done',
      'Invoice:done',
      'Paid:current',
      'Processing:upcoming',
      'Completed:upcoming',
    ])
  })

  it('shows a completed request as fully done', () => {
    const steps = buildRequestTimeline({ status: 'COMPLETED' })
    expect(steps.every((s) => s.state === 'done')).toBe(true)
  })

  it('ends a rejected request where it stopped', () => {
    expect(states(buildRequestTimeline({ status: 'REJECTED' }))).toEqual([
      'Under review:done',
      'Rejected:stopped',
    ])
  })

  it('infers how far a cancelled request got from its invoice and Deliveries', () => {
    expect(
      states(
        buildRequestTimeline({
          status: 'CANCELLED',
          invoice: { status: 'CANCELLED' },
        }),
      ),
    ).toEqual(['Under review:done', 'Invoice:done', 'Cancelled:stopped'])
    expect(
      buildRequestTimeline({
        status: 'CANCELLED',
        invoice: { status: 'PAID' },
        requestReports: [{ status: 'DELIVERED' }],
      }).map((s) => s.label),
    ).toEqual(['Under review', 'Invoice', 'Paid', 'Processing', 'Cancelled'])
  })
})
