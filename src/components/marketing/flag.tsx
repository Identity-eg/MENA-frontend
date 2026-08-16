import * as flags from 'country-flag-icons/react/3x2'
import { cn } from '@/lib/utils'

/**
 * Renders a country flag as an SVG instead of a Unicode flag emoji.
 *
 * Flag emoji (e.g. 🇪🇬) rely on the OS shipping the glyph — Windows desktop
 * browsers don't, and fall back to showing the raw two-letter regional
 * indicator text instead of a flag. SVGs render identically everywhere.
 */
export function Flag({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const Icon = flags[code.toUpperCase() as keyof typeof flags]
  if (!Icon) return null

  return <Icon aria-hidden className={cn('h-3.5 w-auto rounded-[2px]', className)} />
}
