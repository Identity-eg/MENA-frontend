import { memo } from 'react'
import { CheckCircle2 } from 'lucide-react'

export const CompanyDetailUnlockSuccessBanner = memo(
  function CompanyDetailUnlockSuccessBanner() {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20"
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="font-medium">
          Unlock successful. Your data is now visible below.
        </p>
      </div>
    )
  },
)
