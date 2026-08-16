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
import { FullPageLoading } from '@/components/ui/full-page-loading'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  pendingComponent: FullPageLoading,
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
      {
        title:
          'Ident-ity | Source-Verified Business Intelligence Across MENA',
      },
      {
        name: 'description',
        content:
          'On-demand corporate verification, retrieval, and due diligence across 10 MENA jurisdictions and 5M+ companies.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
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
