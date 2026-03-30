import { Loader2 } from 'lucide-react'

export function RequestDetailLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div className="relative">
        <div className="h-14 w-14 rounded-2xl bg-muted/80 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">
          Loading request details...
        </p>
        <p className="text-xs text-muted-foreground">
          Fetching status and deliverables
        </p>
      </div>
    </div>
  )
}
