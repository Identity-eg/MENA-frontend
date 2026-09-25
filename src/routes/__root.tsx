import { PostHogProvider, usePostHog } from '@posthog/react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useRef } from 'react'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { Toaster } from '@/components/ui/sonner'

import { getIsomorphicAccessToken } from '@/apis/base/request-interceptor'
import { getMeQueryOptions } from '@/apis/user/get-me'
import type { TUser } from '@/types/user'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!posthogProjectToken && import.meta.env.DEV) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  )
}

if (!posthogHost && import.meta.env.DEV) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
  )
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
        title: 'Ident-ity | Source-Verified Business Intelligence Across MENA',
      },
      {
        name: 'description',
        content:
          'On-demand corporate verification, retrieval, and due diligence across 10 MENA jurisdictions.',
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
        <AppShell>{children}</AppShell>
        <Scripts />
      </body>
    </html>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const content = (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
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
    </>
  )

  if (!posthogProjectToken || !posthogHost) return content

  return (
    <PostHogProvider
      apiKey={posthogProjectToken}
      options={{
        api_host: posthogHost,
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: import.meta.env.DEV,
      }}
    >
      <PostHogIdentity>{content}</PostHogIdentity>
    </PostHogProvider>
  )
}

function PostHogIdentity({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog()
  const user = Route.useRouteContext({ select: (context) => context.user })
  const identifiedUserId = useRef<number | null>(null)

  useEffect(() => {
    if (!user || identifiedUserId.current === user.id) return

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name,
      role: user.role,
    })
    identifiedUserId.current = user.id
  }, [posthog, user])

  return children
}
