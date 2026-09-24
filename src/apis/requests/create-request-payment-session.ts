import { useMutation } from '@tanstack/react-query'

import { request } from '../base'

type CreatePaymentSessionResponse = {
  success: boolean
  data: { url: string }
}

/**
 * Create a Stripe Checkout Session for the request (must be INVOICE_GENERATED).
 * Returns the URL to redirect the user to Stripe Checkout.
 */
export async function createRequestPaymentSession(
  requestId: number,
  successUrl: string,
  cancelUrl: string,
): Promise<CreatePaymentSessionResponse['data']> {
  const data = await request<CreatePaymentSessionResponse>({
    method: 'POST',
    url: `/requests/${requestId}/create-payment-session`,
    data: { successUrl, cancelUrl },
  })
  return data.data
}

export const useCreateRequestPaymentSession = () => {
  return useMutation({
    mutationFn: (params: {
      requestId: number
      successUrl: string
      cancelUrl: string
    }) =>
      createRequestPaymentSession(
        params.requestId,
        params.successUrl,
        params.cancelUrl,
      ),
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })
}
