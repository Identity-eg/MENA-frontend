import type { TAuthSignatory, TManager, TPartner } from './company'

/** Person rows returned as the unlocked value of partners / managers / authSignatories. */
export type TUnlockedPerson = Omit<TPartner, 'type'> | TManager | TAuthSignatory

/** Shape returned by GET /api/unlocks (list) – one item per unlock, with unlocked value */
export type TUnlock = {
  id: number
  userId: number
  lockedFieldId: number
  /** When the field was unlocked (ISO string) */
  createdAt: string
  /**
   * registrationNumber -> string | null;
   * partners / managers / authSignatories -> array of person objects.
   */
  unlockedValue: string | null | Array<TUnlockedPerson>
  lockedField: {
    company: {
      id: number
      nameEn: string | null
      nameAr: string | null
    }
    lockedType: {
      fieldName: string
    }
    /** Price paid (or listed) for this locked field */
    price: number
  }
}
