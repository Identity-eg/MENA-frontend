import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, ShieldCheck, User } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
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
          <Link to="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
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
        </nav>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground cursor-pointer ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {user.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={async () => {
                    await clearServerCredentials()
                    clearAccessToken()
                    queryClient.clear()
                    router.invalidate()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
