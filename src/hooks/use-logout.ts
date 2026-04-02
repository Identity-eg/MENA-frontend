import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { clearServerCredentials } from '@/lib/auth'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return async () => {
    await clearServerCredentials()
    await router.navigate({ to: '/', replace: true })

    const context = getContext()
    context.queryClient.removeQueries({ queryKey: ['access-token'] })
    queryClient.clear()
    router.invalidate()
  }
}
