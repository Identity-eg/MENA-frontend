import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { memo } from 'react'

import { cn } from '@/lib/utils'

export type UnlockBannerState = 'unlocking' | 'delayed' | 'unlocked'

const MESSAGES: Record<UnlockBannerState, string> = {
  unlocking: 'Payment received, unlocking…',
  delayed:
    'Payment received. Unlocking is taking longer than usual; your data will appear here shortly. You do not need to pay again.',
  unlocked: 'Unlock successful. Your data is now visible below.',
}

export const CompanyDetailUnlockSuccessBanner = memo(
  function CompanyDetailUnlockSuccessBanner({
    state,
  }: {
    state: UnlockBannerState
  }) {
    const Icon =
      state === 'unlocked'
        ? CheckCircle2
        : state === 'delayed'
          ? Clock
          : Loader2

    return (
      <div
        role="status"
        className={cn(
          'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
          state === 'unlocked'
            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20'
            : 'border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300',
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5 shrink-0',
            state === 'unlocked' && 'text-emerald-600 dark:text-emerald-400',
            state === 'unlocking' && 'animate-spin',
          )}
        />
        <p className="font-medium">{MESSAGES[state]}</p>
      </div>
    )
  },
)
