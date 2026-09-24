import { createFileRoute } from '@tanstack/react-router'

import { LegalLayout } from '@/components/legal/legal-layout'
import { FullPageLoading } from '@/components/ui/full-page-loading'

export const Route = createFileRoute('/cookie-policy')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Cookie Policy | Ident-ity' },
      {
        name: 'description',
        content:
          'How Ident-ity uses cookies and similar technologies, and how you can manage your preferences.',
      },
    ],
  }),
  component: CookiePolicyPage,
})

function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="Last updated: September 2026"
    >
      {' '}
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. We also use similar technologies (such as local storage and
        pixels) for some of the purposes described below; where we say
        &ldquo;cookies,&rdquo; we mean all of these unless stated otherwise.
      </p>
      <h2>2. How We Use Cookies</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Purpose</th>
            <th>Can you disable it?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Strictly necessary</strong>
            </td>
            <td>
              Required for the site and registration/login system to function
              (e.g., session state, security, remembering your cookie
              preferences).
            </td>
            <td>No — the site may not work properly without these.</td>
          </tr>
          <tr>
            <td>
              <strong>Analytics / performance</strong>
            </td>
            <td>
              Helps us understand how visitors use the site (e.g., which pages
              are viewed, how long, referral source) so we can improve it. These
              are set by our analytics provider, which may set its own cookies.
            </td>
            <td>Yes, via the cookie banner or your browser settings.</td>
          </tr>
          <tr>
            <td>
              <strong>Functional</strong>
            </td>
            <td>
              Remembers choices you&rsquo;ve made (e.g., form progress) to
              improve your experience across visits.
            </td>
            <td>Yes.</td>
          </tr>
          <tr>
            <td>
              <strong>Marketing</strong>
            </td>
            <td>
              Only used where we run targeted advertising or retargeting
              campaigns.
            </td>
            <td>Yes.</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do <strong>not</strong> currently use cookies to build profiles of
        named individuals for advertising purposes, and we do not sell
        cookie/tracking data to third parties.
      </p>
      <h2>3. Third-Party Cookies</h2>
      <p>
        Some cookies are placed by third-party services we use to operate the
        site (for example, our analytics provider). These third parties have
        their own privacy and cookie policies, which we encourage you to review.
        We limit these to the providers needed to operate, secure, and measure
        the performance of the site.
      </p>
      <h2>4. Managing Your Cookie Preferences</h2>
      <p>
        Where a cookie banner is presented, you can accept or reject
        non-essential cookies and change that choice at any time. You can also
        control or delete cookies through your browser settings; note that
        blocking cookies may affect site functionality, particularly for the
        registration/login system.
      </p>
      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        the cookies and technologies we use. The &ldquo;Last updated&rdquo; date
        above reflects the most recent revision.
      </p>
    </LegalLayout>
  )
}
