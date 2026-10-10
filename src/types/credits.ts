/** GET /credits/balance: the Credits the user can currently spend. */
export type TCreditBalance = {
  balance: number
}

export const CREDIT_TRANSACTION_TYPES = [
  'GRANT',
  'SPEND',
  'REFUND',
  'ADJUSTMENT',
] as const

export type TCreditTransactionType = (typeof CREDIT_TRANSACTION_TYPES)[number]

/** One Credit transaction of the caller (GET /credits/transactions), references expanded. */
export type TCreditTransaction = {
  id: number
  type: TCreditTransactionType
  /** Signed: positive adds Credits, negative removes them. */
  amount: number
  balanceAfter: number
  /** Server-written description, used when nothing more specific can be said. */
  description: string
  /** The admin's reason (Refunds and Adjustments). */
  reason: string | null
  /** ISO timestamp. */
  createdAt: string
  /** The company a Spend unlocked fields of. */
  company: { id: number; nameEn: string | null; nameAr: string | null } | null
  /** The Sensitive fields a Spend paid for, in display order. */
  fields: Array<{ key: string; label: string }>
  /** The Credit plan a Grant came from (null until Plan purchases exist). */
  plan: { id: number; name: string } | null
}

export type TPagePagination = {
  total: number
  page: number
  pageSize: number
  totalPages: number
}
