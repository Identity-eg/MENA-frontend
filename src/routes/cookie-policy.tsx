import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { LegalLayout } from '@/components/legal/legal-layout'

export const Route = createFileRoute('/cookie-policy')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Cookie Policy | Ident-ity' },
      {
        name: 'description',
        content: "Ident-ity's Cookie Policy — draft, pending legal review.",
      },
    ],
  }),
  component: CookiePolicyPage,
})

function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="Last updated: [insert date at publish]"
    >
      <blockquote>
        As with the Privacy Policy and Terms of Service, this is a
        standard-practice draft, not legal advice. If you plan to serve
        visitors from the EU/UK, note that cookie-consent rules there
        (ePrivacy/GDPR) generally require a <strong>prior opt-in</strong>{' '}
        for anything beyond strictly necessary cookies, via a consent
        banner with a genuine &ldquo;reject&rdquo; option — not just a
        notice. Confirm with counsel whether that applies to your expected
        audience, and make sure the actual consent-banner implementation
        matches whatever this policy ends up saying.
      </blockquote>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files placed on your device when you visit
        a website. We also use similar technologies (such as local storage
        and pixels) for some of the purposes described below; where we say
        &ldquo;cookies,&rdquo; we mean all of these unless stated
        otherwise.
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
              Required for the site and registration/login system to
              function (e.g., session state, security, remembering your
              cookie preferences).
            </td>
            <td>No — the site may not work properly without these.</td>
          </tr>
          <tr>
            <td>
              <strong>Analytics / performance</strong>
            </td>
            <td>
              Helps us understand how visitors use the site (e.g., which
              pages are viewed, how long, referral source) so we can
              improve it. We use{' '}
              <strong>
                [Google Analytics 4 / Plausible / your chosen tool]
              </strong>
              , which may set its own cookies.
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
              Only used if we run targeted advertising or retargeting
              campaigns;{' '}
              <strong>
                [remove this row entirely if you don&rsquo;t plan to do
                this]
              </strong>
              .
            </td>
            <td>Yes.</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do <strong>not</strong> currently use cookies to build profiles
        of named individuals for advertising purposes, and we do not sell
        cookie/tracking data to third parties.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        Some cookies are placed by third-party services we use to operate
        the site (for example, our analytics provider). These third
        parties have their own privacy and cookie policies, which we
        encourage you to review.{' '}
        <strong>
          [List specific third parties once your analytics/tooling stack is
          finalized.]
        </strong>
      </p>

      <h2>4. Managing Your Cookie Preferences</h2>
      <p>
        When you first visit our site, you will be shown a cookie banner
        allowing you to accept or reject non-essential cookies. You can
        change your preferences at any time via{' '}
        <strong>
          [a persistent &ldquo;cookie settings&rdquo; link in the footer]
        </strong>
        . You can also control or delete cookies through your browser
        settings; note that blocking cookies may affect site
        functionality, particularly for the registration/login system.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect
        changes in the cookies and technologies we use. The &ldquo;Last
        updated&rdquo; date above reflects the most recent revision.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        <strong>[privacy@ident-ity.com]</strong>
      </p>
    </LegalLayout>
  )
}
