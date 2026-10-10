import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { request } from '../base'
import type { CreditHistoryParams } from '@/lib/credit-history'
import type { TCreditTransaction, TPagePagination } from '@/types/credits'

export type GetCreditTransactionsData = {
  success: boolean
  data: Array<TCreditTransaction>
  pagination: TPagePagination
}

export const getCreditTransactions = async (params: CreditHistoryParams) => {
  const data = await request<GetCreditTransactionsData>({
    url: '/credits/transactions',
    params,
  })
  return data
}

/** Under `['credits']`, so invalidating Credits after a Spend or Grant refreshes the history too. */
export const getCreditTransactionsQueryOptions = (
  params: CreditHistoryParams,
) =>
  queryOptions({
    queryKey: ['credits', 'transactions', params],
    queryFn: () => getCreditTransactions(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })

/** Not suspense: filter and page changes keep the previous page on screen while loading. */
export const useGetCreditTransactions = (params: CreditHistoryParams) =>
  useQuery(getCreditTransactionsQueryOptions(params))
