import { usePostHog } from '@posthog/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { getContext } from '@/integrations/tanstack-query/root-provider'
import { clearServerCredentials } from '@/lib/auth'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const posthog = usePostHog()

  return async () => {
    posthog.capture('user_logged_out')
    posthog.reset()
    await clearServerCredentials()
    await router.navigate({ to: '/', replace: true })

    const context = getContext()
    context.queryClient.removeQueries({ queryKey: ['access-token'] })
    queryClient.clear()
    router.invalidate()
  }
}
