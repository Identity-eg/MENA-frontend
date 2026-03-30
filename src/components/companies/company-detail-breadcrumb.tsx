import { memo } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type CompanyDetailBreadcrumbProps = {
  nameEn: string
}

export const CompanyDetailBreadcrumb = memo(function CompanyDetailBreadcrumb({
  nameEn,
}: CompanyDetailBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/companies"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Companies
      </Link>
      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
      <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
        {nameEn}
      </span>
    </nav>
  )
})
