import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { LegalLayout } from '@/components/legal/legal-layout'

export const Route = createFileRoute('/terms-of-service')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Terms of Service | Ident-ity' },
      {
        name: 'description',
        content:
          "Ident-ity's Terms of Service — draft, pending legal review.",
      },
    ],
  }),
  component: TermsOfServicePage,
})

function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="Last updated: [insert date at publish] · Effective date: [insert date at publish]"
    >
      <blockquote>
        <strong>Important note before you publish this:</strong> this draft
        follows the structure and protective language typical of
        established business-intelligence/due-diligence and data
        providers. It is <strong>not legal advice</strong>, and it has not
        been reviewed by a lawyer. Given that Ident-ity (a) processes
        personal data about third parties, (b) operates across
        jurisdictions with different legal regimes, and (c) lists services
        covering jurisdictions subject to international sanctions (see
        Section 12), we strongly recommend a qualified lawyer reviews this
        before it goes live — particularly the limitation of liability,
        sanctions, and governing law sections, which are the ones most
        likely to need adjustment for your specific corporate structure and
        risk tolerance. Bracketed items <code>[like this]</code> need to be
        filled in or confirmed.
      </blockquote>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Ident-ity website, registration system,
        client portal, or any of our services (collectively, the &ldquo;
        <strong>Services</strong>&rdquo;), you agree to be bound by these
        Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;). If you do
        not agree, do not use the Services. If you are using the Services
        on behalf of a company or other legal entity, you represent that
        you have authority to bind that entity, and &ldquo;you&rdquo;
        refers to that entity.
      </p>

      <h2>2. Who May Use the Services</h2>
      <p>
        The Services are intended for{' '}
        <strong>business and professional use only</strong> and are not
        directed at consumers. By registering, you represent that you are
        acting in a business capacity, that the information you provide
        (company name, role, nationality, work email, LinkedIn profile) is
        accurate, and that you are legally permitted to request the type of
        information or service you are seeking.
      </p>

      <h2>3. Description of Services</h2>
      <p>
        Ident-ity provides, among other things: on-demand corporate
        verification and retrieval services (&ldquo;Ident-RR&rdquo;), a
        structured corporate database (&ldquo;IdentBase&rdquo;), and
        due-diligence research reports (&ldquo;IdentMedia&rdquo;), covering
        multiple MENA jurisdictions, sourced from official registries,
        licensed data sources, and publicly available information. Full
        service descriptions, coverage, and pricing are made available
        only to registered and approved users, as described in Section 5.
      </p>

      <h2>4. Nature of the Data — Read Carefully</h2>
      <p>
        <strong>
          All data, reports, and information we provide are compiled from
          third-party and official sources we do not control.
        </strong>{' '}
        We do not independently verify, and cannot guarantee, the
        accuracy, completeness, currency, or reliability of any
        information contained in our reports or database products.
        Official registries and public sources may themselves contain
        errors, omissions, or outdated information.
      </p>
      <p>
        <strong>
          Our Services are provided &ldquo;AS IS&rdquo; and &ldquo;AS
          AVAILABLE,&rdquo; without any warranty of accuracy, completeness,
          merchantability, fitness for a particular purpose, or
          non-infringement.
        </strong>{' '}
        You are solely responsible for independently verifying any
        information before relying on it for any consequential decision
        (including but not limited to credit, lending, employment,
        tenancy, investment, litigation, or regulatory decisions).
      </p>
      <p>
        Ident-ity is <strong>not</strong> a consumer reporting agency, and
        our products are <strong>not</strong> intended to be used, and must
        not be used, as a &ldquo;consumer report&rdquo; or equivalent under
        any applicable consumer-protection or credit-reporting law. If you
        require data suitable for consumer credit, employment screening, or
        tenant screening decisions regulated by such laws, our Services are
        not appropriate for that purpose, and you must not use them for it.
      </p>

      <h2>5. Registration &amp; Access Approval</h2>
      <p>
        Certain content — including our full service and pricing
        catalogue, jurisdiction-level coverage detail, and sample downloads
        — is only available after registration. To register, you must
        submit: your company name, your role at the company, your
        nationality, a work email address associated with your company,
        and a link to your LinkedIn profile, and verify control of that
        email address via a one-time code.
      </p>
      <p>
        <strong>Registration does not guarantee access.</strong> We review
        each request internally and may approve, decline, or request
        further information at our sole discretion, including where we
        cannot reasonably verify your business affiliation or purpose. We
        reserve the right to suspend or revoke access at any time,
        including after approval, if we determine (or reasonably suspect)
        that our Services are being used in violation of these Terms.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>
        You agree that you will <strong>not</strong> use the Services to:
      </p>
      <ul>
        <li>
          Stalk, harass, intimidate, or unlawfully surveil any individual;
        </li>
        <li>
          Make decisions that unlawfully discriminate against any
          individual on a legally protected basis;
        </li>
        <li>
          Violate the privacy or data protection rights of any individual
          under applicable law;
        </li>
        <li>
          Resell, redistribute, sublicense, scrape, systematically
          extract, or make available to any third party our reports,
          database content, or pricing information, in whole or in part,
          without our prior written consent;
        </li>
        <li>
          Attempt to circumvent our registration/approval process,
          including by using false company information, a personal email
          address, or a fabricated LinkedIn profile;
        </li>
        <li>
          Use automated means (bots, scrapers) to access any part of the
          Services not intended for public access;
        </li>
        <li>
          Use the Services in violation of any applicable law, including
          anti-money-laundering, sanctions, export control, or data
          protection law in your jurisdiction or the jurisdiction of any
          data subject.
        </li>
      </ul>
      <p>
        We reserve the right to investigate suspected violations and to
        suspend or terminate access without notice where we reasonably
        believe a violation has occurred.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on the Ident-ity website and within our reports and
        database products — including text, design, logos
        (&ldquo;ident-ity,&rdquo; &ldquo;Ident-RR,&rdquo;
        &ldquo;IdentBase,&rdquo; &ldquo;IdentMedia,&rdquo; and related
        marks), compilations, and underlying database structure — is owned
        by or licensed to Ident-ity and protected by applicable
        intellectual property laws. Except for the limited right to use
        reports and data you have properly obtained for your own internal
        business purposes, no license is granted to you to reproduce,
        distribute, or create derivative works from our content.
      </p>

      <h2>8. Fees &amp; Payment</h2>
      <p>
        Pricing for our Services is provided to approved registered users
        and clients directly and is not published on our public website.{' '}
        <strong>
          [Insert payment terms, invoicing cadence, currency, and
          late-payment terms once commercial terms are finalized — recommend
          counsel/finance input here.]
        </strong>
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IDENT-ITY DISCLAIMS ALL
        WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
        INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND ANY
        WARRANTY ARISING FROM COURSE OF DEALING OR USAGE OF TRADE. WE DO
        NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR
        SECURE.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
        IDENT-ITY, ITS OFFICERS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        OR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITY,
        ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES OR RELIANCE
        ON ANY INFORMATION PROVIDED, EVEN IF WE HAVE BEEN ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES. OUR TOTAL AGGREGATE LIABILITY FOR ANY
        CLAIM ARISING FROM THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE
        AMOUNT YOU PAID TO US FOR THE SPECIFIC SERVICE GIVING RISE TO THE
        CLAIM IN THE <strong>[X months]</strong> PRECEDING THE CLAIM, OR{' '}
        <strong>[a nominal fixed amount, e.g., USD 100]</strong> IF NO FEES
        WERE PAID.
      </p>
      <p>
        <em>
          [Note: liability caps like this are standard in the industry but
          the specific cap amount and carve-outs (e.g., for gross
          negligence, willful misconduct, or fraud, which many
          jurisdictions won&rsquo;t let you disclaim anyway) should be set
          with counsel.]
        </em>
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold Ident-ity harmless from any
        claims, damages, liabilities, and expenses (including reasonable
        legal fees) arising from your breach of these Terms, your misuse
        of the Services, or your violation of any law or third-party right
        in connection with your use of the Services.
      </p>

      <h2>12. Sanctions &amp; Export Compliance</h2>
      <p>
        Some jurisdictions covered by our Services (including, without
        limitation, Iran and Syria) are subject to international economic
        sanctions and export control regimes administered by bodies
        including, but not limited to, the U.S. Office of Foreign Assets
        Control (OFAC), the European Union, and the United Nations
        Security Council.{' '}
        <strong>
          You represent and warrant that you are not located in, organized
          under the laws of, or ordinarily resident in a country or
          territory subject to comprehensive sanctions, and that you are
          not a person or entity designated on any applicable sanctions or
          restricted-party list.
        </strong>{' '}
        You further agree that you will use any information obtained
        through our Services covering sanctioned jurisdictions only for
        lawful due-diligence, compliance, or research purposes, and not to
        facilitate any transaction that would violate applicable sanctions
        or export control law.
      </p>
      <p>
        Ident-ity reserves the right to decline service, refuse
        registration, or terminate access to any user where we reasonably
        believe provision of the Services would violate applicable
        sanctions or export control law, without liability to you.
      </p>

      <h2>13. Termination</h2>
      <p>
        We may suspend or terminate your access to the Services at any
        time, with or without cause, with or without notice. You may stop
        using the Services at any time. Sections of these Terms that by
        their nature should survive termination (including Sections 4,
        6–13) will survive.
      </p>

      <h2>14. Governing Law &amp; Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of{' '}
        <strong>
          [Arab Republic of Egypt — confirm entity&rsquo;s jurisdiction of
          incorporation]
        </strong>
        , without regard to conflict-of-law principles. Any dispute
        arising out of or relating to these Terms or the Services shall be
        resolved{' '}
        <strong>
          [insert preferred mechanism — courts of Cairo / arbitration under
          (e.g.) the Cairo Regional Centre for International Commercial
          Arbitration — to be confirmed with counsel]
        </strong>
        .
      </p>

      <h2>15. Changes to These Terms</h2>
      <p>
        We may revise these Terms from time to time. Continued use of the
        Services after changes take effect constitutes acceptance of the
        revised Terms. Material changes will be reflected by an updated
        &ldquo;Last updated&rdquo; date.
      </p>

      <h2>16. Contact</h2>
      <p>
        <strong>[Ident-ity legal entity name]</strong>
        <br />
        <strong>[Registered address]</strong>
        <br />
        <strong>[legal@ident-ity.com]</strong>
      </p>
    </LegalLayout>
  )
}
