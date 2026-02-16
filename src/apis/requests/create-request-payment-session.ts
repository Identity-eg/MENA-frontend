import { request } from '../request'

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
): Promise<CreatePaymentSessionResponse['data']> {
  const data = await request<CreatePaymentSessionResponse>({
    method: 'POST',
    url: `/requests/${requestId}/create-payment-session`,
  })
  return data.data
}
