import { useRouteContext } from '@tanstack/react-router'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

/**
 * All three legal pages (Privacy Policy, Terms of Service, Cookie Policy)
 * are first drafts supplied by the client — not reviewed by counsel yet
 * (PRD §14 / FR8). Each page carries its own detailed "not legal advice"
 * blockquote inline in the content, plus this small "Draft" tag for at-a-
 * glance visibility. Do not remove the draft framing when the underlying
 * content is edited — only remove it once the client confirms legal
 * review is complete.
 */
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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              {title}
            </h1>
            <span className="inline-flex h-5 w-fit shrink-0 items-center rounded-full bg-amber-100 px-2.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
              Draft — pending legal review
            </span>
          </div>
          {lastUpdated && (
            <p className="mt-2 text-sm text-muted-foreground">
              {lastUpdated}
            </p>
          )}

          <div className="legal-prose mt-8">{children}</div>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
