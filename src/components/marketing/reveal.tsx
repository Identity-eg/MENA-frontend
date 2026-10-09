import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll-reveal wrapper. One IntersectionObserver per element, disconnected as
 * soon as the element has been shown, so a long marketing page does not keep
 * dozens of live observers around.
 *
 * Reduced-motion and no-IntersectionObserver environments render the content in
 * its final state immediately rather than animating it.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode
  /** Stagger in milliseconds. Keep under ~240ms; longer reads as lag. */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'span'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
        shown
          ? 'translate-y-0 opacity-100'
          : 'motion-safe:translate-y-4 motion-safe:opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
