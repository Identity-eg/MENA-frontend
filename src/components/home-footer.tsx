import { ShieldCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function HomeFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 border-t pt-8 sm:pt-12 md:flex-row">
        <div className="flex items-center gap-2 grayscale opacity-60">
          <ShieldCheck size={20} />
          <span className="text-sm font-bold tracking-tighter">
            CompliancePortal
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-medium text-muted-foreground">
          <Link to="/about-us" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/solutions" className="hover:text-primary transition-colors">
            Solutions
          </Link>
          <Link to="/ident-insights" className="hover:text-primary transition-colors">
            Ident Insights
          </Link>
          <Link to="/lets-talk" className="hover:text-primary transition-colors">
            Let's Talk
          </Link>
          <Link to="/auth/login" className="hover:text-primary transition-colors">
            Login
          </Link>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase">
          &copy; 2026 Compliance Intelligence Platform
        </div>
      </div>
    </footer>
  )
}
