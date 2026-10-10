import { formatCredits } from './credits'
import type {TCreditTransaction, TCreditTransactionType} from '@/types/credits';
import {
  CREDIT_TRANSACTION_TYPES
  
  
} from '@/types/credits'

/** "+1,200 credits", "−50 credits" (typographic minus). */
export function formatSignedCredits(amount: number): string {
  return `${amount < 0 ? '−' : '+'}${formatCredits(Math.abs(amount))}`
}

export const CREDIT_TRANSACTION_TYPE_LABELS: Record<
  TCreditTransactionType,
  string
> = {
  GRANT: 'Grant',
  SPEND: 'Spend',
  REFUND: 'Refund',
  ADJUSTMENT: 'Adjustment',
}

export type CreditTransactionDescription = {
  /** One line saying what happened. */
  summary: string
  /** The admin's reason, for Refunds and Adjustments. */
  reason?: string
  /** The company a Spend unlocked fields of, to link to. */
  company?: { id: number; name: string }
}

/** A readable description of one Credit transaction, from its expanded references. */
export function describeCreditTransaction(
  tx: TCreditTransaction,
): CreditTransactionDescription {
  switch (tx.type) {
    case 'SPEND': {
      const summary =
        tx.fields.length > 0
          ? `Unlocked ${joinLabels(tx.fields.map((f) => f.label))}`
          : tx.description
      const name = tx.company && (tx.company.nameEn || tx.company.nameAr)
      return tx.company && name
        ? { summary, company: { id: tx.company.id, name } }
        : { summary }
    }
    case 'GRANT':
      return {
        summary: tx.plan ? `${tx.plan.name} plan purchased` : tx.description,
      }
    case 'REFUND':
      return withReason('Refunded by an admin', tx.reason)
    case 'ADJUSTMENT':
      return withReason(
        tx.amount > 0
          ? 'Credits added by an admin'
          : 'Credits removed by an admin',
        tx.reason,
      )
  }
}

function withReason(
  summary: string,
  reason: string | null,
): CreditTransactionDescription {
  return reason ? { summary, reason } : { summary }
}

function joinLabels(labels: Array<string>): string {
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** The Credits page's filters as kept in the URL: calendar days (YYYY-MM-DD) and a page. */
export type CreditHistorySearch = {
  type?: TCreditTransactionType
  from?: string
  to?: string
  page?: number
}

const CALENDAR_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

function parseDay(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined
  const match = CALENDAR_DAY.exec(value)
  if (!match) return undefined
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(y, m - 1, d)
  const exists =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  return exists ? date : undefined
}

/** Keeps only the search params the Credits page understands. */
export function parseCreditHistorySearch(
  search: Record<string, unknown>,
): CreditHistorySearch {
  const result: CreditHistorySearch = {}
  if (
    typeof search.type === 'string' &&
    (CREDIT_TRANSACTION_TYPES as ReadonlyArray<string>).includes(search.type)
  ) {
    result.type = search.type as TCreditTransactionType
  }
  if (parseDay(search.from)) result.from = search.from as string
  if (parseDay(search.to)) result.to = search.to as string
  const page = Number(search.page)
  if (search.page !== undefined && Number.isInteger(page) && page >= 1) {
    result.page = page
  }
  return result
}

export type CreditHistoryParams = {
  type?: TCreditTransactionType
  from?: string
  to?: string
  page: number
  pageSize: number
}

/** The API query for the Credits page: chosen days become local start/end-of-day timestamps. */
export function creditHistoryParams(
  search: CreditHistorySearch,
  pageSize: number,
): CreditHistoryParams {
  const params: CreditHistoryParams = { page: search.page ?? 1, pageSize }
  if (search.type) params.type = search.type
  const from = parseDay(search.from)
  if (from) params.from = from.toISOString()
  const to = parseDay(search.to)
  if (to) {
    to.setHours(23, 59, 59, 999)
    params.to = to.toISOString()
  }
  return params
}
