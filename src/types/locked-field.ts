/** A Field offer on a company, as embedded in GET /api/companies/:id `lockedFields[]`. */
export type TLockedField = {
  id: number
  lockedTypeId: number
  lockedType: {
    fieldName: string
  }
  price: number
  /** The viewer's own unlocks only (empty when not unlocked) */
  unlocks: Array<{
    id: number
    userId: number
  }>
}
