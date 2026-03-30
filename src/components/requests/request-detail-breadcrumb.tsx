import { memo } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type RequestDetailBreadcrumbProps = {
  formattedId: string
}

export const RequestDetailBreadcrumb = memo(function RequestDetailBreadcrumb({
  formattedId,
}: RequestDetailBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/requests"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Requests
      </Link>
      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
      <span className="font-medium text-foreground">{formattedId}</span>
    </nav>
  )
})
