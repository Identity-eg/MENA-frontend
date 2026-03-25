import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/react'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { resolveAuthSession } from '@/apis/auth/session'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { getIsomorphicAccessToken } from '@/apis/base/request-interceptor'
import { NotFoundPage } from '@/components/layout/not-found-page'
import { useAuthStore } from '@/stores/auth'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
  accessToken: string | null
}

/**
 * Hydrates the Zustand auth store from the SSR-resolved route context.
 * Bridges the server-side session (cookie) to the client-side Axios
 * interceptor, which reads the Zustand store for the Bearer token.
 * This is the correct TanStack Start pattern for SSR → client state sync.
 */
function RootComponent() {
  const { accessToken } = Route.useRouteContext()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  useEffect(() => {
    if (accessToken) setAccessToken(accessToken)
  }, [accessToken, setAccessToken])

  return <Outlet />
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const isServer = typeof window === 'undefined'

    if (isServer) {
      // Server path (SSR / page load): atomically resolve the session.
      // Reads the access token cookie; silently refreshes via the refresh
      // token if needed; fetches the user — all via native fetch, no Axios.
      const session = await resolveAuthSession()
      return {
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
      }
    }

    // Client path (client-side navigation): the Zustand store is already
    // populated from RootComponent.useEffect on initial hydration, or from
    // the login / token-refresh flows on subsequent navigation.
    const accessToken = getIsomorphicAccessToken()
    if (!accessToken) return { user: null, accessToken: null }

    const meData =
      await context.queryClient.ensureQueryData(getMeQueryOptions())
    return { user: meData?.user ?? null, accessToken }
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Compliance Requests | Third-Party Risk & Compliance' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
