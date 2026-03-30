import { memo } from 'react'
import { Building2, User } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/utils'
import type { RequestDetailSubjectItem } from './request-detail-types'

type RequestDetailSubjectsSidebarProps = {
  subjects: RequestDetailSubjectItem[]
  activeSubjectId: string
  onSelectSubject: (id: string) => void
}

export const RequestDetailSubjectsSidebar = memo(
  function RequestDetailSubjectsSidebar({
    subjects,
    activeSubjectId,
    onSelectSubject,
  }: RequestDetailSubjectsSidebarProps) {
    return (
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Subjects in Request
            </CardTitle>
            <p className="text-xs text-muted-foreground font-normal">
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
            </p>
          </CardHeader>
          <CardContent className="pt-0" role="tablist" aria-label="Subjects">
            {subjects.length === 0 ? (
              <EmptyState
                icon={User}
                title="No subjects"
                description="This request has no subjects yet."
                className="py-8"
              />
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={activeSubjectId === s.id}
                    onClick={() => onSelectSubject(s.id)}
                    className={cn(
                      'min-w-40 shrink-0 lg:min-w-0 lg:shrink rounded-xl border p-3 text-left transition-all flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full',
                      activeSubjectId === s.id
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30 text-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        activeSubjectId === s.id
                          ? 'bg-primary-foreground/20'
                          : 'bg-muted',
                      )}
                    >
                      {s.type === 'Individual' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-sm font-semibold"
                        dir={s.type === 'Individual' ? 'rtl' : 'ltr'}
                      >
                        {s.name}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wider whitespace-nowrap',
                          activeSubjectId === s.id
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground',
                        )}
                      >
                        {s.type} · {s.reports.length} report
                        {s.reports.length !== 1 ? 's' : ''}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    )
  },
)
