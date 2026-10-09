import { useRouteContext } from '@tanstack/react-router'

import { MarketingShell } from '@/components/marketing/marketing-shell'

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated?: string
  children: React.ReactNode
}) {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <MarketingShell user={user}>
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <h1 className="text-3xl font-semibold leading-[1.02] tracking-heading text-brand-navy sm:text-4xl">
          {title}
        </h1>
        {lastUpdated && (
          <p className="mt-3 text-sm text-muted-foreground">{lastUpdated}</p>
        )}

        <div className="legal-prose mt-10">{children}</div>
      </div>
    </MarketingShell>
  )
}
