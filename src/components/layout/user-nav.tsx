import { Link } from '@tanstack/react-router'
import { LogOut, User as UserIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { TUser } from '@/types/user'
import { useLogout } from '@/hooks/use-logout'

interface UserNavProps {
  user: TUser
}

export function UserNav({ user }: UserNavProps) {
  const logout = useLogout()

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.name}`}
        className="flex min-w-0 items-center gap-3 cursor-pointer ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initials}
        </div>
        {/* Below md the avatar alone opens the menu; name and email would crowd the Credit balance. */}
        <div className="hidden min-w-0 flex-col items-start md:flex">
          <p className="max-w-48 truncate text-sm font-medium leading-none">
            {user.name}
          </p>
          <p className="max-w-48 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <Link to="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={async () => await logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
