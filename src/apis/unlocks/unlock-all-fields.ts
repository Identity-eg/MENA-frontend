import { useMutation, useQueryClient } from '@tanstack/react-query'

import { request } from '../base'
import { refetchAfterUnlock, writeUnlockedFields } from './unlock-cache'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TSensitiveField } from '@/types/company'

export type TUnlockAllFieldsInput = {
  companyId: number
  /** The total the user confirmed; the server refuses a different current total. */
  expectedTotal: number
}

/** The fields this request unlocked (with values), the Credit balance after, and the total charged (0 if none were left). */
export type TUnlockAllFieldsResult = {
  fields: Array<TSensitiveField>
  balance: number
  charged: number
}

type UnlockAllFieldsData = TApiResponseSingle<TUnlockAllFieldsResult>

/**
 * POST /api/companies/:id/unlocks/all: one all-or-nothing Spend for every remaining field.
 * Refusals: INSUFFICIENT_CREDITS (details: required, balance, shortfall), FIELD_COST_CHANGED
 * (details: currentTotal), COMPANY_NOT_FOUND.
 */
export const unlockAllFields = async ({
  companyId,
  expectedTotal,
}: TUnlockAllFieldsInput) => {
  return request<UnlockAllFieldsData>({
    url: `/companies/${companyId}/unlocks/all`,
    method: 'POST',
    data: { expectedTotal },
  })
}

/** Never optimistic: fields and balance change only from the server's response, then refetch. */
export const useUnlockAllFields = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlockAllFields,
    onSuccess: ({ data }, { companyId }) =>
      writeUnlockedFields(queryClient, companyId, data.fields, data.balance),
    onSettled: (_data, _error, { companyId }) =>
      refetchAfterUnlock(queryClient, companyId),
  })
}
