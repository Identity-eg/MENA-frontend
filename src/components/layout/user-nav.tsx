import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { TUser } from '@/types/user'
import { clearServerCredentials } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

interface UserNavProps {
  user: TUser
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAccessToken } = useAuthStore()

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initials}
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium leading-none">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">
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
  )
}
