import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { request } from '../base'
import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TCreditBalance } from '@/types/credits'

type GetCreditBalanceData = TApiResponseSingle<TCreditBalance>
type GetCreditBalanceQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetCreditBalanceData>>[0],
  'queryKey' | 'queryFn'
>

export const getCreditBalance = async () => {
  const data = await request<GetCreditBalanceData>({
    url: '/credits/balance',
  })
  return data
}

/** Invalidate with this key after anything that changes the balance (Unlocks, Plan purchases). */
export const getCreditBalanceQueryOptions = (
  options?: GetCreditBalanceQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['credits', 'balance'],
    queryFn: getCreditBalance,
    staleTime: 30 * 1000,
    ...options,
  })

export const useGetCreditBalance = (
  options?: GetCreditBalanceQueryOptionsOverride,
) => {
  return useSuspenseQuery(getCreditBalanceQueryOptions(options))
}
