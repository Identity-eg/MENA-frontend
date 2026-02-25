import { Link } from '@tanstack/react-router'
import { MenuIcon, Undo2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { NotificationDropdown } from './notification-dropdown'
import { useGetMe } from '@/apis/user/get-me'

export function DashboardHeader() {
  const { data: user } = useGetMe()
  const name = user?.user.name

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Undo2Icon className="h-6 w-6 text-primary" />
            <span className="hidden font-medium sm:inline">Back to Home</span>
          </Button>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-bold text-primary">
            {name?.[0]?.toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium sm:inline-block">
            {name}
          </span>
        </div>
      </div>
    </header>
  )
}
