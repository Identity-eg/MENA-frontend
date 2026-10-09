import { Link } from '@tanstack/react-router'

import { jurisdictions } from '@/lib/jurisdictions'
import { Logo } from './brand/logo'

const columns = [
  {
    heading: 'Solutions',
    links: [
      { to: '/solutions' as const, label: 'All solutions' },
      { to: '/portal' as const, label: 'Portal' },
      // { to: '/ident-insights' as const, label: 'Ident Insights' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about-us' as const, label: 'About us' },
      { to: '/lets-talk' as const, label: 'Contact' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { to: '/auth/login' as const, label: 'Login' },
      { to: '/auth/signup' as const, label: 'Get started' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy-policy' as const, label: 'Privacy policy' },
      { to: '/terms-of-service' as const, label: 'Terms of service' },
      { to: '/cookie-policy' as const, label: 'Cookie policy' },
    ],
  },
]

export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-brand-mist/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo size="md" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Source-verified business intelligence across the Middle East and
              North Africa.
            </p>
            <a
              href="https://www.ident-ity.com"
              className="mt-6 inline-block text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand-cyan-ink hover:underline"
            >
              www.ident-ity.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-brand-navy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Jurisdictions served
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {jurisdictions.map((jurisdiction) => (
              <li
                key={jurisdiction.code}
                className="text-sm text-muted-foreground"
              >
                {jurisdiction.name}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 border-t border-border pt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ident-ity. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
