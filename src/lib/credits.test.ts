import { describe, expect, it } from 'vitest'

import { formatCredits } from './credits'

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
