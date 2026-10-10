import { getErrorMessage } from '@/apis/base/error-handler'

/** Why the server refused an Unlock, in the shape the confirmation dialog shows it. */
export type UnlockRefusal =
  | {
      kind: 'insufficient'
      required: number
      balance: number
      shortfall: number
    }
  /** `current`: the Field cost now, or for "Unlock all" the total now. */
  | { kind: 'costChanged'; current: number }
  | { kind: 'other'; message: string }

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/** Reads an Unlock or "Unlock all" error (INSUFFICIENT_CREDITS, FIELD_COST_CHANGED or anything else). */
export function readUnlockRefusal(error: unknown): UnlockRefusal {
  const { message, code, details = {} } = getErrorMessage(error)
  if (
    code === 'INSUFFICIENT_CREDITS' &&
    isCount(details.required) &&
    isCount(details.balance) &&
    isCount(details.shortfall)
  ) {
    return {
      kind: 'insufficient',
      required: details.required,
      balance: details.balance,
      shortfall: details.shortfall,
    }
  }
  if (code === 'FIELD_COST_CHANGED') {
    const current = details.currentCost ?? details.currentTotal
    if (isCount(current)) return { kind: 'costChanged', current }
  }
  return { kind: 'other', message }
}
