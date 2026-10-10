/** GET /credits/balance: the Credits the user can currently spend. */
export type TCreditBalance = {
  balance: number
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
