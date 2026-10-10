import type { RequestCompanyName } from '@/lib/request-display'
import { cn } from '@/lib/utils'

/** English name first; the Arabic name, when present, as a quieter RTL line. */
export function CompanyName({
  company,
  className,
}: {
  company: RequestCompanyName
  className?: string
}) {
  return (
    <span className={cn('flex min-w-0 flex-col', className)}>
      <span className="truncate font-medium text-foreground">
        {company.companyNameEn}
      </span>
      {company.companyNameAr && (
        <span className="truncate text-xs text-muted-foreground">
          <bdi lang="ar">{company.companyNameAr}</bdi>
        </span>
      )}
    </span>
  )
}
