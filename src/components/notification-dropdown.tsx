import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  useMarkNotificationReadMutation,
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from '@/hooks/use-notifications-query'
import { cn } from '@/lib/utils'

function formatTime(ts: number) {
  const now = Date.now()
  const diff = now - ts
  if (diff < 60_000) return 'Just now'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`
  return new Date(ts).toLocaleDateString()
}

export function NotificationDropdown() {
  const { data, isLoading } = useNotificationsQuery()
  const markReadMutation = useMarkNotificationsReadMutation()
  const markItemReadMutation = useMarkNotificationReadMutation()
  const items = data?.data ?? []
  const hasItems = items.length > 0
  const unreadCount = items.filter((n) => !n.readAt).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Notifications
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : !hasItems ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <Link
                  key={n.id}
                  to={
                    n.requestId != null ? '/requests/$requestId' : '/requests'
                  }
                  params={
                    n.requestId != null
                      ? { requestId: String(n.requestId) }
                      : undefined
                  }
                  onClick={() => {
                    if (!n.readAt) {
                      markItemReadMutation.mutate(n.id)
                    }
                  }}
                  className={cn(
                    'flex flex-col items-start gap-0.5 px-2 py-2 text-left text-sm rounded-md transition-colors relative',
                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none',
                    !n.readAt && 'bg-accent/30',
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className={cn('font-medium', !n.readAt && 'text-primary')}>
                      {n.title}
                    </span>
                    {!n.readAt && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  {n.description && (
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {n.description}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(n.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                markReadMutation.mutate()
              }}
              disabled={markReadMutation.isPending || unreadCount === 0}
              className="text-muted-foreground"
            >
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
