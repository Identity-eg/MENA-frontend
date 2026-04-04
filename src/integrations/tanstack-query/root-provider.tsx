import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import type { ReactNode } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

const getQueryClient = createIsomorphicFn()
  .server(() => {
    return makeQueryClient()
  })
  .client(() => {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  })

export function getContext() {
  return {
    queryClient: getQueryClient(),
  }
}

export default function TanStackQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
