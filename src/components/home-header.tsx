import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import type { TUser } from '@/types/user'
import { UserNav } from './layout/user-nav'

const navLinks = [
  { to: '/' as const, label: 'Home' },
  { to: '/about-us' as const, label: 'About Us' },
  { to: '/solutions' as const, label: 'Solutions' },
]

export function HomeHeader({ user }: { user?: TUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative border-b bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Brand */}
        <div className="flex items-center gap-3" data-testid="brand-home">
          <div className="grid h-10 w-10 place-items-center rounded-xl border bg-card">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div
              className="text-sm font-bold tracking-tight"
              data-testid="text-brand-title"
            >
              CompliancePortal
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Third-Party Risk
            </div>
          </div>
        </div>

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
              <Button variant="ghost" size="sm">
                <Link to="/auth/login" data-testid="link-login">
                  Login
                </Link>
              </Button>
              <Button size="sm">
                <Link to="/auth/signup" data-testid="link-signup">
                  Get Started
                </Link>
              </Button>
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
                  to="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  data-testid="link-signup-mobile"
                >
                  <Button size="sm" className="w-full">
                    Get Started
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
