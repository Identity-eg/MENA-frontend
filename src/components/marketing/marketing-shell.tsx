import type { TUser } from '@/types/user'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { cn } from '@/lib/utils'

/**
 * The dark surface every public marketing route sits on. Holding the header,
 * footer, and background in one place keeps the page chrome identical across
 * routes and leaves the authenticated portal on its own light theme.
 */
export function MarketingShell({
  user,
  children,
  className,
}: {
  user?: TUser | null
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'min-h-screen bg-white text-foreground antialiased',
        className,
      )}
    >
      <HomeHeader user={user ?? undefined} />
      <main className="relative">{children}</main>
      <HomeFooter />
    </div>
  )
}
