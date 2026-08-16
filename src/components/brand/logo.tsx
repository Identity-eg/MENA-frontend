import { cn } from '@/lib/utils'

/**
 * Typographic placeholder for the Ident-ity wordmark.
 *
 * The client has production-ready vector logo files (PRD §7) that were not
 * available in this build. This component is the single swap-in point —
 * once the real SVGs land, replace the markup below with <img>/inline SVG
 * and every call site (header, footer, auth pages, solution cards) updates
 * automatically.
 */

const sizes = {
  sm: { mark: 'size-6 text-xs', word: 'text-sm', reg: 'text-[7px]' },
  md: { mark: 'size-8 text-sm', word: 'text-lg', reg: 'text-[8px]' },
  lg: { mark: 'size-10 text-base', word: 'text-2xl', reg: 'text-[10px]' },
} as const

export function Logo({
  tone = 'navy',
  size = 'md',
  className,
}: {
  tone?: 'navy' | 'white'
  size?: keyof typeof sizes
  className?: string
}) {
  const s = sizes[size]
  const wordColor = tone === 'white' ? 'text-white' : 'text-brand-navy'
  const regColor = tone === 'white' ? 'text-white/60' : 'text-brand-navy/50'

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className={cn(
          'grid shrink-0 place-items-center rounded-lg bg-brand-navy text-brand-cyan',
          s.mark,
        )}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[55%] w-[55%]">
          <rect x="10.69" y="10.13" width="2.63" height="9" rx="1.31" />
          <circle cx="12" cy="6.19" r="2.06" />
        </svg>
      </span>
      <span
        className={cn(
          'font-extrabold lowercase tracking-tight',
          s.word,
          wordColor,
        )}
      >
        ident-ity
        <sup className={cn('ms-0.5 font-semibold', s.reg, regColor)}>®</sup>
      </span>
    </span>
  )
}

/** Sub-brand wordmarks (Ident-RR, IdentBase, IdentMedia, pipeline marks). */
export type SolutionMark =
  | 'ident-RR'
  | 'ident-base'
  | 'ident-media'
  | 'ident-legas'
  | 'ident-Map'
  | 'ident-media+'

type SolutionMeta = {
  label: string
  suffix: string
  italic?: boolean
  plus?: boolean
}

const solutionMeta: Record<SolutionMark, SolutionMeta> = {
  'ident-RR': { label: 'ident-', suffix: 'RЯ' },
  'ident-base': { label: 'ident-', suffix: 'base' },
  'ident-media': { label: 'ident-', suffix: 'media' },
  'ident-legas': { label: 'ident-', suffix: 'legas', italic: true },
  'ident-Map': { label: 'ident-', suffix: 'Map' },
  'ident-media+': { label: 'ident-', suffix: 'media', plus: true },
}

export function SolutionWordmark({
  mark,
  tone = 'white',
  className,
}: {
  mark: SolutionMark
  tone?: 'navy' | 'white'
  className?: string
}) {
  const meta = solutionMeta[mark]
  const color = tone === 'white' ? 'text-white' : 'text-brand-navy'

  return (
    <span
      className={cn(
        'inline-flex items-baseline font-extrabold tracking-tight',
        color,
        className,
      )}
    >
      {meta.label}
      <span className={cn(meta.italic && 'italic')}>{meta.suffix}</span>
      {meta.plus && (
        <sup className="ms-0.5 text-brand-lime text-[0.6em]">+</sup>
      )}
    </span>
  )
}
