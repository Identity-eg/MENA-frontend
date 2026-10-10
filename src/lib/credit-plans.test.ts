import { describe, expect, it } from 'vitest'

import { describePlanValues, formatPlanPrice } from './credit-plans'

const plan = (id: number, priceCents: number, credits: number) => ({
  id,
  priceCents,
  credits,
})

describe('formatPlanPrice', () => {
  it('shows whole-dollar prices without cents', () => {
    expect(formatPlanPrice(2900)).toBe('$29')
    expect(formatPlanPrice(19900)).toBe('$199')
  })
  it('keeps cents when there are some', () => {
    expect(formatPlanPrice(7950)).toBe('$79.50')
  })
})

describe('describePlanValues', () => {
  const seeded = [plan(1, 2900, 300), plan(2, 7900, 1000), plan(3, 19900, 3000)]

  it('gives each plan its price per Credit', () => {
    const values = describePlanValues(seeded)
    expect(values.get(1)?.perCredit).toBe('$0.097 per credit')
    expect(values.get(2)?.perCredit).toBe('$0.079 per credit')
    expect(values.get(3)?.perCredit).toBe('$0.066 per credit')
  })

  it('shows how much cheaper each Credit is than on the priciest plan, rounded down', () => {
    const values = describePlanValues(seeded)
    expect(values.get(1)?.savingPercent).toBeNull()
    // 0.079 / 0.09667 = 0.817 -> 18% cheaper
    expect(values.get(2)?.savingPercent).toBe(18)
    // 0.06633 / 0.09667 = 0.686 -> 31% cheaper
    expect(values.get(3)?.savingPercent).toBe(31)
  })

  it('shows no saving for a lone plan or plans with the same rate', () => {
    expect(
      describePlanValues([plan(1, 2900, 300)]).get(1)?.savingPercent,
    ).toBeNull()
    const same = describePlanValues([plan(1, 1000, 100), plan(2, 2000, 200)])
    expect(same.get(1)?.savingPercent).toBeNull()
    expect(same.get(2)?.savingPercent).toBeNull()
  })

  it('uses cents per Credit once a Credit costs a dollar or more', () => {
    expect(describePlanValues([plan(1, 1000, 10)]).get(1)?.perCredit).toBe(
      '$1.00 per credit',
    )
  })
})
