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
  /** The Credit plan a Grant came from (or a Refund was recorded against). */
  plan: { id: number; name: string } | null
}

export type TPagePagination = {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** GET /credit-plans: a Credit plan on sale, a one-time pack of Credits for a USD price. */
export type TCreditPlan = {
  id: number
  name: string
  description: string
  priceCents: number
  currency: 'USD'
  credits: number
  validityDays: number | null
  badge: string | null
  displayOrder: number
}

/** GET /sensitive-fields: what Unlocking one kind of Sensitive field costs, for any company. */
export type TFieldCost = {
  key: string
  label: string
  cost: number
}

export type TPlanPurchaseStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'

/** GET /credits/purchases(/:id): one Stripe checkout for a Credit plan, with the plan as it was bought. */
export type TPlanPurchase = {
  id: number
  planId: number
  planName: string
  priceCents: number
  currency: 'USD'
  credits: number
  status: TPlanPurchaseStatus
  /** ISO timestamps. */
  createdAt: string
  paidAt: string | null
  /** The Grant that added the Credits, with the balance right after it; null until PAID. */
  grant: { transactionId: number; balanceAfter: number } | null
}
