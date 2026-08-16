import { Link, createFileRoute } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { LegalLayout } from '@/components/legal/legal-layout'

export const Route = createFileRoute('/privacy-policy')({
  pendingComponent: FullPageLoading,
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Ident-ity' },
      {
        name: 'description',
        content: "Ident-ity's Privacy Policy — draft, pending legal review.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="Last updated: [insert date at publish] · Effective date: [insert date at publish]"
    >
      <blockquote>
        <strong>Important note before you publish this:</strong> this is a
        first draft, written to reflect common practice among established
        business-intelligence and due-diligence providers (the kind of
        language used by firms like LexisNexis, Refinitiv/World-Check, and
        Dow Jones Risk &amp; Compliance). It is <strong>not legal advice</strong>.
        Ident-ity operates across multiple jurisdictions (Egypt, GCC states,
        and others) and processes personal data about third parties as part
        of its core service — this is a higher-risk legal profile than a
        typical marketing website. Please have this reviewed by a lawyer
        qualified in Egyptian data protection law (and any other
        jurisdiction where you have staff, servers, or active clients)
        before publishing. Bracketed items <code>[like this]</code> need to
        be filled in or confirmed by you or your counsel.
      </blockquote>

      <h2>1. Who We Are</h2>
      <p>
        Ident-ity (&ldquo;<strong>Ident-ity</strong>,&rdquo; &ldquo;
        <strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>,&rdquo; or
        &ldquo;<strong>our</strong>&rdquo;) is a business intelligence and
        corporate due-diligence company operating across the Middle East and
        North Africa (MENA) region. This Privacy Policy explains how we
        collect, use, disclose, and protect information in two distinct
        contexts:
      </p>
      <ul>
        <li>
          <strong>
            (A) Information about visitors to our website and users of our
            registration/portal system
          </strong>{' '}
          (e.g., you, browsing ident-ity.com); and
        </li>
        <li>
          <strong>
            (B) Information about third-party individuals and companies
          </strong>{' '}
          that appears within the due-diligence reports, corporate records
          retrieval, and structured data products we deliver to our clients.
        </li>
      </ul>
      <p>
        These two categories are governed differently, and we address each
        separately below because the obligations that apply to them are not
        the same.
      </p>
      <p>
        Data controller: <strong>[Ident-ity legal entity name]</strong>,
        registered in <strong>[jurisdiction]</strong>. Contact:{' '}
        <strong>[privacy@ident-ity.com or equivalent]</strong>.
      </p>

      <hr />

      <h2>2. Part A — Website Visitors, Registrants &amp; Contacts</h2>

      <h3>2.1 What we collect</h3>
      <ul>
        <li>
          <strong>Contact form submissions:</strong> name, work email,
          company name, jurisdiction of interest, service interest, and any
          message you provide.
        </li>
        <li>
          <strong>Registration / access-request submissions:</strong>{' '}
          company name, your role at the company, nationality, work email
          address, and LinkedIn profile URL, submitted when you request
          access to gated service, pricing, or coverage information.
        </li>
        <li>
          <strong>Account verification data:</strong> a one-time
          verification code sent to your work email to confirm you control
          that address.
        </li>
        <li>
          <strong>Technical &amp; usage data:</strong> IP address,
          browser/device type, pages visited, and similar analytics data
          collected automatically via cookies and similar technologies (see
          our <Link to="/cookie-policy">Cookie Policy</Link>).
        </li>
      </ul>

      <h3>2.2 Why we collect it</h3>
      <ul>
        <li>
          To respond to inquiries and provide requested information or
          quotes.
        </li>
        <li>
          To evaluate and process registration/access requests, including
          verifying that the requester is a legitimate business user (not a
          consumer) before granting access to our service catalogue,
          pricing, or data-coverage details.
        </li>
        <li>
          To operate, secure, and improve our website and (once launched)
          our client portal.
        </li>
        <li>
          To send you information you have requested, and — only with your
          consent where required — occasional updates about our services.
        </li>
      </ul>

      <h3>
        2.3 Legal basis (where applicable, e.g., under GDPR-equivalent
        frameworks)
      </h3>
      <p>
        We process this data on the basis of: (a) our legitimate interest in
        responding to business inquiries and vetting access requests to
        protect commercially sensitive information; (b) taking steps at
        your request prior to entering into a contract; and (c) consent,
        where you have opted in to marketing communications.
      </p>

      <h3>2.4 Registration review &amp; approval</h3>
      <p>
        Access to our detailed service catalogue, pricing, and
        data-coverage information is granted only after internal review of
        your registration submission. We may decline or revoke access at
        our sole discretion, including where we cannot verify your business
        affiliation, where your registration email does not correspond to a
        genuine business domain, or where we reasonably believe access is
        being sought for a purpose inconsistent with our{' '}
        <Link to="/terms-of-service">Terms of Service</Link>.
      </p>

      <h3>2.5 Retention</h3>
      <p>
        We retain website-visitor and registrant data for as long as
        reasonably necessary to fulfil the purposes above, resolve
        disputes, and enforce our agreements, and in any case no longer
        than <strong>[X months/years — confirm with counsel]</strong> after
        your last interaction with us, unless a longer period is required
        by law.
      </p>

      <h3>2.6 Your rights</h3>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or restrict our use of your personal data, and to object to
        certain processing. To exercise these rights, contact us at{' '}
        <strong>[privacy@ident-ity.com]</strong>. We will respond within the
        timeframe required by applicable law.
      </p>

      <hr />

      <h2>3. Part B — Third-Party Data Within Our Reports &amp; Data Products</h2>
      <p>
        This section is central to our business and should be read
        carefully by anyone whose information appears in an Ident-ity
        product, and by every client who uses one.
      </p>

      <h3>3.1 Nature of the data</h3>
      <p>
        Our Ident-RR, IdentBase, and IdentMedia products contain
        information about companies and, in some cases, named individuals
        (e.g., directors, shareholders, or subjects of a
        reverse-directorship or verification check). This information is
        compiled from{' '}
        <strong>
          official government registries, public filings, licensed data
          sources, and publicly available media
        </strong>{' '}
        in the jurisdictions where we operate. We do not solicit or process
        this data directly from the individuals concerned, and in most
        cases we have no direct relationship with them.
      </p>

      <h3>3.2 Basis for processing</h3>
      <p>
        Where applicable law requires a lawful basis for processing
        personal data about identifiable individuals who are not our
        direct customers, we rely on our (and our clients&rsquo;){' '}
        <strong>legitimate interest</strong> in verifying corporate and
        individual identities for due diligence, compliance (e.g.,
        KYC/AML), legal, and risk-management purposes — interests that are
        widely recognized as legitimate under data protection frameworks
        applicable to the regulated industries our clients serve (banking,
        law, compliance).
      </p>

      <h3>3.3 No guarantee of accuracy or completeness</h3>
      <p>
        Data in our reports and products is provided{' '}
        <strong>&ldquo;as is&rdquo; and &ldquo;as available.&rdquo;</strong>{' '}
        It is sourced from third parties and official channels we do not
        control, may be incomplete, outdated, or contain errors originating
        at the source, and{' '}
        <strong>
          must not be treated as a substitute for independent verification.
        </strong>{' '}
        We disclaim liability for decisions made in reliance on this data —
        see our <Link to="/terms-of-service">Terms of Service</Link> for
        the full disclaimer and limitation of liability.
      </p>

      <h3>3.4 Permitted use by clients</h3>
      <p>
        Clients who receive our reports or data agree, under our Terms of
        Service, to use them only for lawful purposes (such as legitimate
        KYC, AML, litigation support, or commercial due diligence), and not
        to use them for unlawful discrimination, stalking, harassment, or
        any purpose prohibited by the law of the jurisdiction in which the
        data subject is located.
      </p>

      <h3>3.5 Requests from individuals named in our data</h3>
      <p>
        If you are an individual who believes information about you
        appears in an Ident-ity report or database and you have concerns
        about its accuracy or your rights regarding it, contact us at{' '}
        <strong>[privacy@ident-ity.com]</strong>. We will review requests
        on a case-by-case basis consistent with our obligations to our
        clients and applicable law; where source data originates from an
        official government registry, corrections generally need to be
        made at the source, and we will direct you accordingly where
        possible.
      </p>

      <hr />

      <h2>4. Security</h2>
      <p>
        We use administrative, technical, and physical safeguards designed
        to protect the data we hold, including access controls limiting who
        within our team can view registration and report data. No system is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>5. International Transfers</h2>
      <p>
        Because we operate across multiple MENA jurisdictions and may use
        cloud infrastructure hosted outside your country (e.g., AWS
        regions), your data may be transferred to and processed in
        countries other than your own.{' '}
        <strong>
          [Insert transfer-mechanism language once your hosting regions and
          client base are finalized — this typically needs counsel input.]
        </strong>
      </p>

      <h2>6. Children&rsquo;s Privacy</h2>
      <p>
        Our website and services are directed at businesses and
        professionals, not consumers, and are not intended for use by
        anyone under 18.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the most recent revision.
        Material changes will be reflected on this page.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        <strong>[Ident-ity legal entity name]</strong>
        <br />
        <strong>[Registered address]</strong>
        <br />
        <strong>[privacy@ident-ity.com]</strong>
      </p>
    </LegalLayout>
  )
}
