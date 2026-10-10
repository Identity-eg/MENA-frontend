import type { TSensitiveField, TSensitiveFieldState } from '@/types/company'

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

/** What "Unlock all remaining fields" costs: the summed Field costs of locked fields, no discount. */
export function unlockAllTotal(fields: Array<TSensitiveField>): number {
  return fields
    .filter((field) => displayState(field) === 'locked')
    .reduce((sum, field) => sum + field.cost, 0)
}

/** Whether to offer "Unlock all remaining fields": only while at least two fields remain locked. */
export function offersUnlockAll(fields: Array<TSensitiveField>): boolean {
  return fields.filter((field) => displayState(field) === 'locked').length >= 2
}
