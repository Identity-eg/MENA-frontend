import { describe, expect, it } from 'vitest'

import {
  creditHistoryParams,
  describeCreditTransaction,
  formatSignedCredits,
  parseCreditHistorySearch,
} from './credit-history'
import type { TCreditTransaction } from '@/types/credits'

function transaction(
  overrides: Partial<TCreditTransaction> = {},
): TCreditTransaction {
  return {
    id: 1,
    type: 'ADJUSTMENT',
    amount: 100,
    balanceAfter: 100,
    description: 'Credits added by an admin',
    reason: null,
    createdAt: '2026-10-11T09:00:00.000Z',
    company: null,
    fields: [],
    plan: null,
    ...overrides,
  }
}

const acme = { id: 7, nameEn: 'Acme Trading', nameAr: 'أكمي' }

describe('formatSignedCredits', () => {
  it('signs Credits added with a plus and Credits removed with a minus, grouped', () => {
    expect(formatSignedCredits(1200)).toBe('+1,200 credits')
    expect(formatSignedCredits(-50)).toBe('−50 credits')
    expect(formatSignedCredits(1)).toBe('+1 credit')
    expect(formatSignedCredits(-1)).toBe('−1 credit')
  })
})

describe('describeCreditTransaction', () => {
  it('a Spend names the field and links the company', () => {
    const spend = transaction({
      type: 'SPEND',
      amount: -50,
      company: acme,
      fields: [{ key: 'registrationNumber', label: 'Registration number' }],
      description: 'Unlocked Registration number of Acme Trading',
    })
    expect(describeCreditTransaction(spend)).toEqual({
      summary: 'Unlocked Registration number',
      company: { id: 7, name: 'Acme Trading' },
    })
  })

  it('a Spend covering several fields lists them all', () => {
    const spend = transaction({
      type: 'SPEND',
      amount: -300,
      company: acme,
      fields: [
        { key: 'registrationNumber', label: 'Registration number' },
        { key: 'partners', label: 'Partners' },
        { key: 'managers', label: 'Managers' },
      ],
    })
    expect(describeCreditTransaction(spend).summary).toBe(
      'Unlocked Registration number, Partners and Managers',
    )
    expect(
      describeCreditTransaction({ ...spend, fields: spend.fields.slice(0, 2) })
        .summary,
    ).toBe('Unlocked Registration number and Partners')
  })

  it('a Spend falls back to the Arabic company name, then to the server description', () => {
    const spend = transaction({
      type: 'SPEND',
      amount: -50,
      company: { id: 7, nameEn: null, nameAr: 'أكمي' },
      fields: [],
      description: 'Unlocked Partners of أكمي',
    })
    expect(describeCreditTransaction(spend)).toEqual({
      summary: 'Unlocked Partners of أكمي',
      company: { id: 7, name: 'أكمي' },
    })
  })

  it('a Grant names the plan', () => {
    const grant = transaction({
      type: 'GRANT',
      amount: 500,
      plan: { id: 2, name: 'Growth' },
    })
    expect(describeCreditTransaction(grant)).toEqual({
      summary: 'Growth plan purchased',
    })
  })

  it('a Grant without a plan uses the server description', () => {
    const grant = transaction({
      type: 'GRANT',
      amount: 500,
      description: 'Welcome Credits',
    })
    expect(describeCreditTransaction(grant)).toEqual({
      summary: 'Welcome Credits',
    })
  })

  it("an Adjustment shows which way it went and the admin's reason", () => {
    expect(
      describeCreditTransaction(
        transaction({ amount: 250, reason: 'Onboarding bonus' }),
      ),
    ).toEqual({
      summary: 'Credits added by an admin',
      reason: 'Onboarding bonus',
    })
    expect(
      describeCreditTransaction(
        transaction({ amount: -40, reason: 'Granted by mistake' }),
      ),
    ).toEqual({
      summary: 'Credits removed by an admin',
      reason: 'Granted by mistake',
    })
  })

  it("a Refund shows the admin's reason", () => {
    expect(
      describeCreditTransaction(
        transaction({ type: 'REFUND', amount: -500, reason: 'Charged twice' }),
      ),
    ).toEqual({ summary: 'Refunded by an admin', reason: 'Charged twice' })
  })
})

describe('parseCreditHistorySearch', () => {
  it('keeps a known type, calendar dates and a positive page', () => {
    expect(
      parseCreditHistorySearch({
        type: 'SPEND',
        from: '2026-02-01',
        to: '2026-02-28',
        page: 3,
      }),
    ).toEqual({ type: 'SPEND', from: '2026-02-01', to: '2026-02-28', page: 3 })
  })

  it('drops anything it does not understand', () => {
    expect(
      parseCreditHistorySearch({
        type: 'BONUS',
        from: 'yesterday',
        to: '2026-02-30',
        page: -1,
      }),
    ).toEqual({})
    expect(parseCreditHistorySearch({ page: '2' })).toEqual({ page: 2 })
    expect(parseCreditHistorySearch({ page: 1.5 })).toEqual({})
  })
})

describe('creditHistoryParams', () => {
  it('sends the type and page, and nothing for unset filters', () => {
    expect(creditHistoryParams({ type: 'GRANT', page: 2 }, 20)).toEqual({
      type: 'GRANT',
      page: 2,
      pageSize: 20,
    })
    expect(creditHistoryParams({}, 20)).toEqual({ page: 1, pageSize: 20 })
  })

  it('turns the chosen days into the start and end of those days in local time', () => {
    const { from, to } = creditHistoryParams(
      { from: '2026-02-01', to: '2026-02-01' },
      20,
    )
    const start = new Date(from!)
    const end = new Date(to!)
    expect([start.getFullYear(), start.getMonth(), start.getDate()]).toEqual([
      2026, 1, 1,
    ])
    expect([start.getHours(), start.getMinutes()]).toEqual([0, 0])
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000 - 1)
  })
})
