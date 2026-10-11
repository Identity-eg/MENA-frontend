import { describe, expect, it } from 'vitest'

import {
  displayState,
  groupSensitiveFields,
  unlockAllFields,
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

describe('unlockAllFields', () => {
  it('lists the fields the server offers to Unlock all, in the offer order', () => {
    const fields = [
      field({ key: 'registrationNumber', cost: 50 }),
      field({ key: 'partners', cost: 100, state: 'unlocked', value: [] }),
      field({ key: 'managers', cost: 75 }),
      field({ key: 'authSignatories', cost: 75 }),
    ]
    expect(
      unlockAllFields(fields, {
        total: 125,
        fieldKeys: ['managers', 'registrationNumber'],
      }).map((f) => f.key),
    ).toEqual(['managers', 'registrationNumber'])
  })

  it('is empty when nothing is offered', () => {
    expect(unlockAllFields([field({})], null)).toEqual([])
  })
})
