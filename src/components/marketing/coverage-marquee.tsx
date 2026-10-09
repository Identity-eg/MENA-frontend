import { Flag } from '@/components/marketing/flag'
import { jurisdictions } from '@/lib/jurisdictions'
import { cn } from '@/lib/utils'

/**
 * Breadth strip for the 12 covered jurisdictions. A marquee rather than a
 * wrapped badge grid: the point is coverage at a glance, not a checklist.
 *
 * The list is rendered twice for a seamless loop; the duplicate is hidden from
 * assistive tech so the countries are announced once.
 */
export function CoverageMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className="flex shrink-0 items-center gap-3 pe-3 motion-safe:animate-[marquee_46s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]"
        >
          {jurisdictions.map((jurisdiction) => (
            <li
              key={jurisdiction.code}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-brand-mist px-4 py-2 text-sm font-medium text-foreground"
            >
              <Flag code={jurisdiction.code} />
              {jurisdiction.name}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
