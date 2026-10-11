import type {
  TSensitiveField,
  TSensitiveFieldState,
  TUnlockAllOffer,
} from '@/types/company'

/**
 * How a Sensitive field is shown. The server decides; a value it sent (an admin sees every
 * value) is always shown as unlocked.
 */
export function displayState(field: TSensitiveField): TSensitiveFieldState {
  return field.value !== undefined ? 'unlocked' : field.state
}

export type SensitiveFieldGroups = Record<
  TSensitiveFieldState,
  Array<TSensitiveField>
>

/** The company's Sensitive fields by how they are shown, each group in the server's order. */
export function groupSensitiveFields(
  fields: Array<TSensitiveField>,
): SensitiveFieldGroups {
  const groups: SensitiveFieldGroups = {
    locked: [],
    unlocked: [],
    unavailable: [],
  }
  for (const field of fields) groups[displayState(field)].push(field)
  return groups
}

/**
 * The fields the server offers to "Unlock all", in the offer's order. Which fields remain and
 * what they cost together is the server's call (`company.unlockAll`); this only looks them up.
 */
export function unlockAllFields(
  fields: Array<TSensitiveField>,
  offer: TUnlockAllOffer | null,
): Array<TSensitiveField> {
  if (!offer) return []
  return offer.fieldKeys.flatMap((key) => fields.filter((f) => f.key === key))
}
