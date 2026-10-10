const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** A plan price in cents as USD: "$29", "$79.50". */
export function formatPlanPrice(priceCents: number): string {
  const text = usd.format(priceCents / 100)
  // Intl drops a trailing zero ("$79.5"); prices always show whole cents.
  return /\.\d$/.test(text) ? `${text}0` : text
}

type PricedPlan = { id: number; priceCents: number; credits: number }

export type PlanValue = {
  /** "$0.079 per credit". */
  perCredit: string
  /** Whole percent a Credit is cheaper than on the priciest plan, or null when it isn't. */
  savingPercent: number | null
}

/** How much a Credit costs on each plan, and how that compares across the plans shown. */
export function describePlanValues(
  plans: ReadonlyArray<PricedPlan>,
): Map<number, PlanValue> {
  const rate = (p: PricedPlan) => p.priceCents / p.credits
  const highest = Math.max(...plans.map(rate))
  return new Map(
    plans.map((p) => {
      const dollars = rate(p) / 100
      const saving = Math.floor((1 - rate(p) / highest) * 100)
      return [
        p.id,
        {
          perCredit: `$${dollars >= 1 ? dollars.toFixed(2) : dollars.toFixed(3)} per credit`,
          savingPercent: saving >= 1 ? saving : null,
        },
      ]
    }),
  )
}
