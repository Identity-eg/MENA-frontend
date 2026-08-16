export type Differentiator = {
  title: string
  description: string
  accent?: 'cyan' | 'lime' | 'muted'
}

// The 6 "Why Us" differentiators, copy adapted from the partnership deck
// (PRD §6.1 / §7 UI pattern: feature card with a colored top-border accent).
export const whyUs: Array<Differentiator> = [
  {
    title: 'Direct Source Access',
    description:
      'Verification retrieved directly from official channels — no intermediaries, no aggregators.',
  },
  {
    title: 'Competitive Pricing',
    description:
      'Competitive pricing per service, with bulk arrangements available for regular partners.',
  },
  {
    title: '1–3 Business Day Turnaround',
    description: 'We deliver fast without compromising source integrity.',
  },
  {
    title: 'Digital Platform',
    description:
      'A closed-cycle online portal for request submission, status tracking, and delivery — no email chains. Launching soon.',
  },
  {
    title: 'Flexible Scope',
    description:
      "Don't see what you need in our catalogue? Ask us — our network extends beyond the standard list.",
  },
  {
    title: 'Sample & Guidance Library',
    description:
      'Every service item comes with a verified output sample and guidance note, so you know exactly what to expect.',
  },
]
