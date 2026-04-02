import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { getIsomorphicAccessToken } from '@/apis/base/request-interceptor'
import { NotFoundPage } from '@/components/layout/not-found-page'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const accessToken = await getIsomorphicAccessToken()

    if (!accessToken) return { user: null }

    const meData =
      await context.queryClient.ensureQueryData(getMeQueryOptions())

    await context.queryClient.setQueryData(['access-token'], accessToken)

    return { user: meData?.user ?? null }
  },
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
        {children}
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
