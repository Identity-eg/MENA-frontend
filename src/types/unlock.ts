import type { TAuthSignatory, TManager, TPartner } from './company'

/** Person rows returned as the unlocked value of partners / managers / authSignatories. */
export type TUnlockedPerson = Omit<TPartner, 'type'> | TManager | TAuthSignatory

/** One of the viewer's Unlocks (GET /api/unlocks), with the field's current value. */
export type TUnlock = {
  id: number
  /** When the field was unlocked (ISO string) */
  createdAt: string
  /** Credits spent on this Unlock */
  creditsCharged: number
  company: {
    id: number
    nameEn: string | null
    nameAr: string | null
  }
  field: {
    key: string
    label: string
  }
  /**
   * registrationNumber -> string | null;
   * partners / managers / authSignatories -> array of person objects.
   */
  value: string | null | Array<TUnlockedPerson>
}
