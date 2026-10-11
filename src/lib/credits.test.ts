import { describe, expect, it } from 'vitest'

import {
  balanceAfter,
  canAfford,
  formatCreditCount,
  formatCredits,
  shortfall,
} from './credits'

describe('formatCredits', () => {
  it('groups thousands and pluralises', () => {
    expect(formatCredits(1000)).toBe('1,000 credits')
    expect(formatCredits(75)).toBe('75 credits')
    expect(formatCredits(0)).toBe('0 credits')
  })

  it('uses the singular for exactly one Credit', () => {
    expect(formatCredits(1)).toBe('1 credit')
  })
})

describe('formatCreditCount', () => {
  it('is the bare grouped number, for tight spaces where an icon says "Credits"', () => {
    expect(formatCreditCount(12500)).toBe('12,500')
    expect(formatCreditCount(1)).toBe('1')
  })
})

describe('affordability', () => {
  it('a balance covering the Field cost can afford it, down to exactly 0 left', () => {
    expect(canAfford(300, 50)).toBe(true)
    expect(canAfford(150, 150)).toBe(true)
    expect(balanceAfter(300, 50)).toBe(250)
    expect(balanceAfter(150, 150)).toBe(0)
    expect(shortfall(300, 50)).toBe(0)
  })

  it('a balance below the Field cost cannot afford it and reports the shortfall', () => {
    expect(canAfford(60, 100)).toBe(false)
    expect(canAfford(0, 75)).toBe(false)
    expect(shortfall(60, 100)).toBe(40)
    expect(shortfall(0, 75)).toBe(75)
  })

  it('never shows a negative balance after', () => {
    expect(balanceAfter(60, 100)).toBe(0)
  })
})
