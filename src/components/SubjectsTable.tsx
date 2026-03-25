import { cn } from '@/lib/utils'
import type { Subject } from '@/types'
import { displayIndividualName } from '@/types/individual'
import { Button } from './ui/button'

interface SubjectsTableProps {
  subjects: Subject[]
  readonly?: boolean
  onRemove?: (id: string) => void
  className?: string
}

export function SubjectsTable({
  subjects,
  readonly = true,
  onRemove,
  className,
}: SubjectsTableProps) {
  if (subjects.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-border bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        No subjects added yet.
      </div>
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        className,
      )}
    >
      <div className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
        Subjects
      </div>
      <div className="divide-y divide-border">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-2 md:grid-cols-4"
          >
            {subject.type === 'Individual' ? (
              <>
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <p className="font-medium text-foreground">
                    {displayIndividualName(subject)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Country</span>
                  <p className="font-medium text-foreground">
                    {subject.country ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">ID Number</span>
                  <p className="font-medium text-foreground">
                    {subject.idNumber ?? '—'}
                  </p>
                </div>
                {!readonly && onRemove && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemove(subject.id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <span className="text-muted-foreground">Company Name</span>
                  <p className="font-medium text-foreground">
                    {subject.companyName ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Country</span>
                  <p className="font-medium text-foreground">
                    {subject.country ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Registration #</span>
                  <p className="font-medium text-foreground">
                    {subject.registrationNumber ?? '—'}
                  </p>
                </div>
                {!readonly && onRemove && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onRemove(subject.id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
