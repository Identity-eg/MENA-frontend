import { describe, expect, it } from 'vitest'

import {
  displayState,
  groupSensitiveFields,
  unlockAllTotal,
} from './sensitive-fields'
import type { TSensitiveField } from '@/types/company'

const field = (overrides: Partial<TSensitiveField>): TSensitiveField => ({
  key: 'partners',
  label: 'Partners',
  cost: 100,
  state: 'locked',
  ...overrides,
})

describe('displayState', () => {
  it('follows the server state', () => {
    expect(displayState(field({ state: 'locked' }))).toBe('locked')
    expect(displayState(field({ state: 'unavailable' }))).toBe('unavailable')
    expect(
      displayState(field({ state: 'unlocked', value: [{ nameAr: 'شريك' }] })),
    ).toBe('unlocked')
  })

  it('shows a value the server sent (admins) as unlocked', () => {
    expect(displayState(field({ state: 'locked', value: 'REG-1' }))).toBe(
      'unlocked',
    )
  })
})

describe('groupSensitiveFields', () => {
  it('splits fields by state and keeps the server order', () => {
    const fields = [
      field({ key: 'registrationNumber', cost: 50 }),
      field({ key: 'partners', state: 'unlocked', value: [] }),
      field({ key: 'managers', cost: 75 }),
      field({ key: 'authSignatories', state: 'unavailable' }),
    ]
    const groups = groupSensitiveFields(fields)
    expect(groups.locked.map((f) => f.key)).toEqual([
      'registrationNumber',
      'managers',
    ])
    expect(groups.unlocked.map((f) => f.key)).toEqual(['partners'])
    expect(groups.unavailable.map((f) => f.key)).toEqual(['authSignatories'])
  })
})

describe('unlockAllTotal', () => {
  it('sums the Field costs of locked fields only, with no discount', () => {
    expect(
      unlockAllTotal([
        field({ key: 'registrationNumber', cost: 50 }),
        field({ key: 'partners', cost: 100 }),
        field({ key: 'managers', cost: 75, state: 'unlocked', value: [] }),
        field({ key: 'authSignatories', cost: 75, state: 'unavailable' }),
      ]),
    ).toBe(150)
  })

  it('is 0 when nothing is left to unlock', () => {
    expect(unlockAllTotal([])).toBe(0)
  })
})
