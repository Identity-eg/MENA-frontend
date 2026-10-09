import type { TUnlockedPerson } from '@/types/unlock'

const FIELD_LABELS: Record<string, string> = {
  registrationNumber: 'Registration number',
  partners: 'Partners',
  managers: 'Managers',
  authSignatories: 'Authorized signatories',
}

export function formatUnlockFieldName(fieldName: string): string {
  return (
    FIELD_LABELS[fieldName] ??
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ')
  )
}

export type UnlockedPersonView = {
  name: string
  /** Role-specific details (nationality, share, position, signature level…) */
  details: Array<string>
}

const pick = (
  en: string | null | undefined,
  ar: string | null | undefined,
): string | null => en?.trim() || ar?.trim() || null

/** A person row as a readable name plus role details (prefers English, falls back to Arabic). */
export function describeUnlockedPerson(
  fieldName: string,
  person: TUnlockedPerson,
): UnlockedPersonView {
  const p = person as Partial<
    Record<string, string | number | null | undefined>
  >
  const text = (key: string) => {
    const value = p[key]
    return value == null || value === '' ? null : String(value)
  }

  const name = pick(text('nameEn'), text('nameAr')) ?? 'Unnamed'
  const details: Array<string | null> = []

  if (fieldName === 'partners') {
    const percentage = text('percentage')
    details.push(
      percentage
        ? `${percentage}${percentage.includes('%') ? '' : '%'} share`
        : null,
      pick(text('roleEn'), text('roleAr')),
      pick(text('designationEn'), text('designationAr')),
    )
  } else if (fieldName === 'managers') {
    details.push(
      pick(text('positionEn'), text('positionAr')),
      pick(text('roleEn'), text('roleAr')),
    )
  } else if (fieldName === 'authSignatories') {
    details.push(
      pick(text('designationEn'), text('designationAr')),
      pick(text('signatureLevelEn'), text('signatureLevelAr')),
      pick(text('authorizationLimitEn'), text('authorizationLimitAr')),
    )
  }
  details.push(pick(text('nationalityEn'), text('nationalityAr')))

  return {
    name,
    details: details.filter((d): d is string => d != null),
  }
}
