const creditNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** "1,000 credits", "1 credit". */
export function formatCredits(amount: number): string {
  return `${creditNumber.format(amount)} ${amount === 1 ? 'credit' : 'credits'}`
}

/** Whether a Credit balance covers a cost. */
export function canAfford(balance: number, cost: number): boolean {
  return balance >= cost
}

/** The Credit balance left after spending `cost`; never below 0 (the server refuses that). */
export function balanceAfter(balance: number, cost: number): number {
  return Math.max(0, balance - cost)
}

/** How many Credits are missing to cover `cost`; 0 when the balance covers it. */
export function shortfall(balance: number, cost: number): number {
  return Math.max(0, cost - balance)
}
