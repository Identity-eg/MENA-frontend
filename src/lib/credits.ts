const creditNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** "1,000 credits", "1 credit". */
export function formatCredits(amount: number): string {
  return `${creditNumber.format(amount)} ${amount === 1 ? 'credit' : 'credits'}`
}
