import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import type { TUser } from '@/types/user'
import { Logo } from './brand/logo'
import { UserNav } from './layout/user-nav'
import { Button } from './ui/button'

const navLinks = [
  { to: '/' as const, label: 'Home' },
  { to: '/about-us' as const, label: 'About' },
  { to: '/solutions' as const, label: 'Solutions' },
  { to: '/lets-talk' as const, label: 'Contact' },
  { to: '/portal' as const, label: 'Portal' },
]

export function HomeHeader({ user }: { user?: TUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        scrolled || mobileOpen
          ? 'border-b border-border bg-white/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link to="/" data-testid="brand-home" className="shrink-0">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === '/' }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-navy data-[status=active]:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:block">
              <UserNav user={user} />
            </div>
          ) : (
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                to="/auth/login"
                data-testid="link-login"
                className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
              >
                Login
              </Link>
              <Link to="/auth/signup" data-testid="link-contact-cta">
                <Button
                  size="sm"
                  className="h-9 rounded-full bg-brand-navy px-4 text-[13px] font-semibold text-white transition-transform hover:bg-brand-navy/90 active:scale-[0.98]"
                >
                  Get started
                </Button>
              </Link>
            </nav>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-brand-navy hover:bg-brand-mist md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-2 sm:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="border-b border-border/60 py-3.5 text-[15px] font-medium text-foreground last:border-b-0"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-border py-3">
                <UserNav user={user} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t border-border py-4">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  data-testid="link-login-mobile"
                  className="py-2 text-[15px] font-medium text-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  data-testid="link-contact-cta-mobile"
                >
                  <Button
                    size="lg"
                    className="h-11 w-full rounded-full bg-brand-navy text-[15px] font-semibold text-white"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
