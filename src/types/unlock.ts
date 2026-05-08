/** Shape returned by GET /api/unlocks (list) – one item per unlock, with unlocked value */
export type TUnlock = {
  id: number
  userId: number
  lockedFieldId: number
  /** When the field was unlocked (ISO string) */
  createdAt?: string
  /** Value of the unlocked field (e.g. phone, address) from the company */
  unlockedValue: string | number | Array<string> | null
  lockedField: {
    company: {
      id: number
      companyNameEn: string
      companyNameAr: string | null
    }
    lockedType: {
      id: number
      fieldName: string
    }
    /** Price paid (or listed) for this locked field */
    price: number
  }
}
