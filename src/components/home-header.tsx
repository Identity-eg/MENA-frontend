import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Logo } from './brand/logo'
import { UserNav } from './layout/user-nav'
import type { TUser } from '@/types/user'

const navLinks = [
  { to: '/' as const, label: 'Home' },
  { to: '/about-us' as const, label: 'About' },
  { to: '/solutions' as const, label: 'Solutions' },
  { to: '/lets-talk' as const, label: 'Contact' },
  { to: '/portal' as const, label: 'Portal' },
]

export function HomeHeader({ user }: { user?: TUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link to="/" data-testid="brand-home" className="shrink-0">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="ghost" size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:block">
              <UserNav user={user} />
            </div>
          ) : (
            <nav className="hidden sm:flex items-center gap-2">
              <Link to="/auth/login" data-testid="link-login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/lets-talk" data-testid="link-contact-cta">
                <Button size="sm">Request a Report</Button>
              </Link>
            </nav>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            {user && (
              <div className="border-t pt-2 mt-1">
                <UserNav user={user} />
              </div>
            )}

            {!user && (
              <div className="flex flex-col gap-1 border-t pt-2 mt-1">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  data-testid="link-login-mobile"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  to="/lets-talk"
                  onClick={() => setMobileOpen(false)}
                  data-testid="link-contact-cta-mobile"
                >
                  <Button size="sm" className="w-full">
                    Request a Report
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
