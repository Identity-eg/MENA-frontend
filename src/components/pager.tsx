import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type PagerProps = {
  /** Names the navigation landmark, e.g. "Credit history pages". */
  label: string
  page: number
  totalPages: number
  total: number
  pageSize: number
  /** While the next page loads. */
  disabled?: boolean
  onPageChange: (page: number) => void
}

/** Previous/next paging for a page-numbered list, with the range shown. Hidden for a single page. */
export function Pager({
  label,
  page,
  totalPages,
  total,
  pageSize,
  disabled = false,
  onPageChange,
}: PagerProps) {
  if (totalPages <= 1) return null
  const first = (page - 1) * pageSize + 1
  const last = Math.min(total, page * pageSize)

  return (
    <nav
      aria-label={label}
      className="mt-5 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {first}–{last} of {total.toLocaleString('en-US')}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-11 sm:h-9"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden className="rtl:rotate-180" />
          Previous
        </Button>
        <span className="px-2 text-sm text-muted-foreground tabular-nums">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          className="h-11 sm:h-9"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight aria-hidden className="rtl:rotate-180" />
        </Button>
      </div>
    </nav>
  )
}
