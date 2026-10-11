import { getCompanyQueryOptions } from '../company/get-company'
import { getCreditBalanceQueryOptions } from '../credits/get-credit-balance'
import { getUnlocksQueryOptions } from './get-unlocks'
import type { QueryClient } from '@tanstack/react-query'

import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TCompany, TSensitiveField } from '@/types/company'
import type { TCreditBalance } from '@/types/credits'

/**
 * Writes the server's answer to an Unlock into the cache: the unlocked fields (with their
 * values) into the company, and the Credit balance after. Never optimistic.
 */
export function writeUnlockedFields(
  queryClient: QueryClient,
  companyId: number,
  unlocked: Array<TSensitiveField>,
  balance: number,
) {
  const byKey = new Map(unlocked.map((field) => [field.key, field]))
  queryClient.setQueryData(
    getCompanyQueryOptions(companyId).queryKey,
    (previous: TApiResponseSingle<TCompany> | undefined) =>
      previous && {
        ...previous,
        data: {
          ...previous.data,
          sensitiveFields: previous.data.sensitiveFields.map(
            (field) => byKey.get(field.key) ?? field,
          ),
        },
      },
  )
  queryClient.setQueryData(
    getCreditBalanceQueryOptions().queryKey,
    (previous: TApiResponseSingle<TCreditBalance> | undefined) => ({
      success: previous?.success ?? true,
      data: { balance },
    }),
  )
}

/** After an Unlock, whatever its outcome: on success fields, balance and history changed; on a refusal our copy is stale. */
export function refetchAfterUnlock(
  queryClient: QueryClient,
  companyId: number,
) {
  queryClient.invalidateQueries({
    queryKey: getCompanyQueryOptions(companyId).queryKey,
  })
  queryClient.invalidateQueries({ queryKey: ['credits'] })
  queryClient.invalidateQueries({ queryKey: getUnlocksQueryOptions().queryKey })
}
