export type Solution = {
  slug: string
  mark: string
  status: 'Active' | 'Soon'
  description: string
  bullets?: Array<string>
  cta?: string
}

// Teaser-only copy per the client's revised policy (PRD §6.3 / FR10): one
// paragraph + a few high-level bullets per active solution, no jurisdiction
// tables, no data-depth tables, no numbers that could be read as a quote.
export const activeSolutions: Array<Solution> = [
  {
    slug: 'ident-rr',
    mark: 'ident-RR',
    status: 'Active',
    description:
      'On-demand corporate verification, retrieval, and due diligence checks across 10+ MENA jurisdictions, sourced directly from official channels and delivered in 1–3 business days.',
    bullets: [
      'Direct-from-source retrieval — no intermediaries',
      '10+ jurisdictions across the Middle East & North Africa',
      '1–3 business day turnaround',
      'Litigation, reputational & corporate registry checks',
    ],
    cta: 'Register for the full service & pricing catalogue',
  },
  {
    slug: 'ident-base',
    mark: 'ident-base',
    status: 'Active',
    description:
      'A structured, continuously verified database covering 5M+ MENA companies, refreshed monthly and available via bulk delivery.',
    bullets: [
      'Ownership, amendments & corporate structure',
      'Monthly refresh cycle',
      'Bulk file delivery for enrichment pipelines',
      'Multi-jurisdiction coverage',
    ],
    cta: 'Register to view covered countries',
  },
  {
    slug: 'ident-media',
    mark: 'ident-media',
    status: 'Active',
    description:
      'Due diligence research reports produced by our research team — delivered in Arabic, English, or both, with two levels of depth depending on your needs.',
    bullets: [
      'Arabic & English delivery',
      'Two depth levels available',
      'Human-researched — not automated',
      'Regional media & legal filings',
    ],
    cta: 'Request a sample report',
  },
]

export const pipelineSolutions: Array<Solution> = [
  {
    slug: 'ident-legas',
    mark: 'ident-legas',
    status: 'Soon',
    description:
      'Official gazette & legal publications database across 10 jurisdictions, Arabic-first.',
  },
  {
    slug: 'ident-map',
    mark: 'ident-Map',
    status: 'Soon',
    description:
      'Personnel intelligence across ministries, state-owned entities & quasi-government bodies.',
  },
  {
    slug: 'ident-media-plus',
    mark: 'ident-media+',
    status: 'Soon',
    description:
      'AI-generated adverse media reports, trained on MENA risk data — designed to complement human research.',
  },
]
