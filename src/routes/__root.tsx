import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { NuqsAdapter } from 'nuqs/adapters/react'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { useAuthStore } from '@/stores/auth'
import { getIsomorphicAccessToken } from '@/apis/request/request-interceptor'
import { NotFoundPage } from '@/components/layout/not-found-page'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
  accessToken: string | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    // On server: reads cookie — works perfectly
    // On client: this return value was serialized into HTML by SSR,
    // so TanStack Router provides it synchronously — no fetch needed
    const accessToken = getIsomorphicAccessToken()

    if (!accessToken) {
      return { user: null, accessToken: null }
    }

    const user = await context.queryClient.ensureQueryData(getMeQueryOptions())
    return { user, accessToken }
  },
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Compliance Requests | Third-Party Risk & Compliance',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { accessToken } = Route.useRouteContext()

  const store = useAuthStore()

  if (accessToken && !store.accessToken) {
    store.setAccessToken(accessToken)
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
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
