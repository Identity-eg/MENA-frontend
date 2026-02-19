import { Link, useRouter } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import type { TUser } from '@/types/user'
import { clearServerCredentials } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

export function HomeHeader({ user }: { user?: TUser | null }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAccessToken } = useAuthStore()

  return (
    <header className="relative border-b bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/about-us">
            <Button variant="ghost" size="sm">
              About Us
            </Button>
          </Link>
          <Link to="/solutions">
            <Button variant="ghost" size="sm">
              Solutions
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
        </nav>

        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await clearServerCredentials()
              clearAccessToken()
              queryClient.removeQueries({ queryKey: ['me'] })
              router.invalidate()
            }}
          >
            Logout
          </Button>
        ) : (
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
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
      </div>
    </header>
  )
}
