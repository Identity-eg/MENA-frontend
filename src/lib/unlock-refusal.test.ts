import { describe, expect, it } from 'vitest'

import { readUnlockRefusal } from './unlock-refusal'

describe('readUnlockRefusal', () => {
  it('reads the shortfall of an INSUFFICIENT_CREDITS refusal', () => {
    expect(
      readUnlockRefusal({
        status: 409,
        message: 'Not enough Credits',
        code: 'INSUFFICIENT_CREDITS',
        details: { required: 100, balance: 60, shortfall: 40 },
      }),
    ).toEqual({
      kind: 'insufficient',
      required: 100,
      balance: 60,
      shortfall: 40,
    })
  })

  it('reads the new Field cost of a FIELD_COST_CHANGED refusal', () => {
    expect(
      readUnlockRefusal({
        status: 409,
        message: 'The Field cost changed to 120 Credits',
        code: 'FIELD_COST_CHANGED',
        details: { currentCost: 120 },
      }),
    ).toEqual({ kind: 'costChanged', current: 120 })
  })

  it('reads the new total of an "Unlock all" FIELD_COST_CHANGED refusal', () => {
    expect(
      readUnlockRefusal({
        status: 409,
        message: 'The total for the remaining fields changed to 320 Credits',
        code: 'FIELD_COST_CHANGED',
        details: { currentTotal: 320 },
      }),
    ).toEqual({ kind: 'costChanged', current: 320 })
  })

  it('shows anything else, including a refusal missing its details, as a message', () => {
    expect(
      readUnlockRefusal({
        status: 409,
        message: 'This field cannot be unlocked',
        code: 'FIELD_UNAVAILABLE',
      }),
    ).toEqual({ kind: 'other', message: 'This field cannot be unlocked' })
    expect(
      readUnlockRefusal({ message: 'Odd', code: 'INSUFFICIENT_CREDITS' }),
    ).toEqual({ kind: 'other', message: 'Odd' })
    expect(readUnlockRefusal(new Error('Network Error'))).toEqual({
      kind: 'other',
      message: 'Network Error',
    })
  })
})
