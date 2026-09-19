import { useRouteContext } from '@tanstack/react-router'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

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
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-muted-foreground">{lastUpdated}</p>
          )}

          <div className="legal-prose mt-8">{children}</div>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
