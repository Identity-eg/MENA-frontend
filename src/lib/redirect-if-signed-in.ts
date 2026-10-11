import { redirect } from '@tanstack/react-router'

import type { TUser } from '@/types/user'

/** `beforeLoad` for guest-only pages (login, signup, …): a signed-in user goes to the dashboard. */
export function redirectIfSignedIn({
  context,
}: {
  context: { user: TUser | null }
}) {
  if (context.user) throw redirect({ to: '/dashboard' })
}
