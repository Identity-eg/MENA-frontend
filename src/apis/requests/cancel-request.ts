import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TApiResponseSingle } from '@/types/api-response-single'
import type { TRequest } from '@/types/request'
import { request } from '../base'

type CancelRequestData = TApiResponseSingle<TRequest>

/**
 * POST /api/requests/:id/cancel (owner). Allowed from UNDER_REVIEW and
 * INVOICE_GENERATED; voids the open invoice. 409 NOT_CANCELLABLE otherwise.
 */
export const cancelRequest = async (requestId: number) => {
  return request<CancelRequestData>({
    url: `/requests/${requestId}/cancel`,
    method: 'POST',
  })
}

export const useCancelRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelRequest,
    onSettled: (_data, _error, requestId) => {
      // On success the status changed; on 409 our copy is stale. Refetch either way.
      queryClient.invalidateQueries({ queryKey: ['request', requestId] })
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}
