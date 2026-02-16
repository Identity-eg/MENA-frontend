import { request } from '../request'

type CreateUnlockPaymentSessionResponse = {
  success: boolean
  data: { url: string }
}

/**
 * Create a Stripe Checkout Session for unlocking a locked field.
 * Returns the URL to redirect the user to Stripe Checkout.
 */
export async function createUnlockPaymentSession(
  lockedFieldId: number,
  successUrl: string,
  cancelUrl: string,
): Promise<CreateUnlockPaymentSessionResponse['data']> {
  const data = await request<CreateUnlockPaymentSessionResponse>({
    method: 'POST',
    url: '/unlocks/create-payment-session',
    data: { lockedFieldId, successUrl, cancelUrl },
  })
  return data.data
}
