import { request } from '../request'

type CreateUnlockAllPaymentSessionResponse = {
  success: boolean
  data: { url: string }
}

/**
 * Create a Stripe Checkout Session for unlocking multiple locked fields in one payment.
 * Returns the URL to redirect the user to Stripe Checkout.
 */
export async function createUnlockAllPaymentSession(
  lockedFieldIds: number[],
  successUrl: string,
  cancelUrl: string,
): Promise<CreateUnlockAllPaymentSessionResponse['data']> {
  const data = await request<CreateUnlockAllPaymentSessionResponse>({
    method: 'POST',
    url: '/unlocks/create-payment-session-bulk',
    data: { lockedFieldIds, successUrl, cancelUrl },
  })
  return data.data
}
