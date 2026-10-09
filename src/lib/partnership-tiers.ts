export type PartnershipTier = {
  index: string
  title: string
  description: string
}

// "Three ways we can work together" (PRD §6.1 / deck slide 8).
export const partnershipTiers: Array<PartnershipTier> = [
  {
    index: '01',
    title: 'Verification Partner',
    description:
      'We handle every corporate verification, retrieval, and due diligence checks you need across 12 jurisdictions. Fast, direct, reliable.',
  },
  {
    index: '02',
    title: 'Data Enrichment Partner',
    description:
      'Provide IdentBase as a structured data feed to enrich your corporate intelligence layer for MENA. 5M+ companies, refreshed monthly.',
  },
  {
    index: '03',
    title: 'Research/HUMAN ENQUIRIES Partner',
    description:
      'Deliver human source enquiries and due diligence media reports in Arabic and/or English through IdentMedia, covering the depth and language capability that most networks lack in this region.',
  },
]
