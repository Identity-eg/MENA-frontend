import { Link } from '@tanstack/react-router'
import { Logo } from './brand/logo'
import { jurisdictions } from '@/lib/jurisdictions'

const footerLinks = [
  { to: '/about-us' as const, label: 'About Us' },
  { to: '/solutions' as const, label: 'Solutions' },
  { to: '/lets-talk' as const, label: 'Contact' },
  { to: '/portal' as const, label: 'Portal' },
  { to: '/auth/login' as const, label: 'Login' },
]

const legalLinks = [
  { to: '/privacy-policy' as const, label: 'Privacy Policy' },
  { to: '/terms-of-service' as const, label: 'Terms of Service' },
  { to: '/cookie-policy' as const, label: 'Cookie Policy' },
]

export function HomeFooter() {
  return (
    <footer className="border-t bg-brand-mist/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Logo size="sm" />
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Source-verified business intelligence across the Middle East &
              North Africa.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-brand-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 sm:mt-10 sm:pt-8">
          <div className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 md:text-left">
            Jurisdictions served
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:justify-start">
            {jurisdictions.map((j, i) => (
              <span key={j.code}>
                {j.name}
                {i < jurisdictions.length - 1 && (
                  <span className="text-muted-foreground/40"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t pt-6 text-[11px] text-muted-foreground/70 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} ident-ity. All rights reserved.</span>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-brand-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span>www.ident-ity.com</span>
        </div>
      </div>
    </footer>
  )
}
