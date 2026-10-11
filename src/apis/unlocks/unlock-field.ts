import { useMutation, useQueryClient } from '@tanstack/react-query'

import { request } from '../base'
import { refetchAfterUnlock, writeUnlockedFields } from './unlock-cache'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TSensitiveField } from '@/types/company'

export type TUnlockFieldInput = {
  companyId: number
  fieldKey: TSensitiveField['key']
  /** The Field cost the user confirmed; the server refuses a different current cost. */
  expectedCost: number
}

/** The unlocked field with its current value, the Credit balance after, and what was charged (0 if already unlocked). */
export type TUnlockFieldResult = {
  field: TSensitiveField
  balance: number
  charged: number
}

type UnlockFieldData = TApiResponseSingle<TUnlockFieldResult>

/**
 * POST /api/companies/:id/unlocks. Refusals: INSUFFICIENT_CREDITS (details: required, balance,
 * shortfall), FIELD_COST_CHANGED (details: currentCost), FIELD_UNAVAILABLE, COMPANY_NOT_FOUND.
 */
export const unlockField = async ({
  companyId,
  fieldKey,
  expectedCost,
}: TUnlockFieldInput) => {
  return request<UnlockFieldData>({
    url: `/companies/${companyId}/unlocks`,
    method: 'POST',
    data: { fieldKey, expectedCost },
  })
}

/**
 * Never optimistic: the field and the balance change only from the server's response, then
 * everything that depends on them is refetched.
 */
export const useUnlockField = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlockField,
    onSuccess: ({ data }, { companyId }) =>
      writeUnlockedFields(queryClient, companyId, [data.field], data.balance),
    onSettled: (_data, _error, { companyId }) =>
      refetchAfterUnlock(queryClient, companyId),
  })
}
