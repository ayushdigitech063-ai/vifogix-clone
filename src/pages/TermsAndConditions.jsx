import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Scale,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "1. Overview & Agreement",
    icon: FileText,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Welcome to <span className="font-semibold text-fg">Sumit dev tech</span>. By accessing,
          browsing, or using our platform, marketplace services, and publisher tools, you
          acknowledge that you have read, understood, and agreed to be bound by these Terms and
          Conditions.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          These terms govern all transactions, account registrations, content publications, and
          communications between buyers, publishers (sellers), and Vefogix. If you do not agree
          with any part of these terms, you must discontinue using our services immediately.
        </p>
      </>
    ),
  },
  {
    id: "user-accounts",
    title: "2. User Accounts & Responsibilities",
    icon: UserCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          To access our guest posting marketplace, order services, or list websites as a publisher,
          you must create an authenticated account. You agree to:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Provide accurate, current, and complete registration information.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Maintain the confidentiality and security of your account credentials.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Notify Sumit dev tech immediately upon discovering unauthorized account access.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Assume full responsibility for all activities and orders conducted under your account.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "publisher-terms",
    title: "3. Publisher & Website Listing Terms",
    icon: ShieldCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Publishers submitting domains to our marketplace must adhere to strict quality and
          ownership guidelines:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-border bg-cream/40 p-4">
            <h4 className="text-sm font-semibold text-fg">Domain Ownership & Verification</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              You must legitimately own or hold authorized representation for any website domain
              submitted. All listings undergo administrative review and verification before
              becoming publicly active.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-cream/40 p-4">
            <h4 className="text-sm font-semibold text-fg">Turnaround Time & Link Permanence</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Publishers agree to publish approved articles within the committed turnaround days
              (typically 1–3 business days). Placed links must remain live and indexed for a minimum
              of 12 continuous months unless specified as permanent.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-cream/40 p-4">
            <h4 className="text-sm font-semibold text-fg">Quality Standards & Metrics</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Domains involved in link farming, deceptive redirects, de-indexed networks (PBNs), or
              spam practices will be immediately suspended with funds withheld.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "payments-refunds",
    title: "4. Payments, Escrow & Fees",
    icon: CreditCard,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          All financial transactions through the marketplace are subject to the following billing
          policies:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Payment Escrow:</strong> Buyer payments are securely held
              in escrow until the publisher delivers live proof of publication.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Publisher Payouts:</strong> Earnings are credited to the
              publisher balance after the buyer approves the live post or after the automated
              review window expires.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Pricing Transparency:</strong> Displayed prices for guest
              posts and content writing are final. Applicable gateway processing fees are shown at
              checkout.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "content-guidelines",
    title: "5. Content Policy & Prohibited Niches",
    icon: AlertTriangle,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Vefogix maintains high search authority standards. All submitted articles and backlinks
          must comply with Google Webmaster Guidelines.
        </p>
        <div className="mt-3 rounded-lg border border-accent-red/20 bg-accent-red/5 p-4 text-sm text-fg">
          <p className="font-semibold text-accent-red">Strictly Prohibited Niches:</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Adult content, illicit substances, weapons, malware/phishing, non-consensual imagery, hate
            speech, or deceptive financial schemes. Listings or orders violating this policy are
            terminated without refund.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property Rights",
    icon: Scale,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          All platform interfaces, proprietary algorithms, trademarks, visual styling, and brand
          assets are the intellectual property of Vefogix. Users may not copy, reverse engineer, or
          scrape content from our marketplace without explicit written authorization.
        </p>
      </>
    ),
  },
  {
    id: "liability-termination",
    title: "7. Limitation of Liability & Termination",
    icon: HelpCircle,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Vefogix provides link facilitation and outreach services. While we enforce domain quality
          checks, we do not guarantee specific third-party search engine rankings, algorithm shifts,
          or organic traffic influx.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          We reserve the right to suspend or permanently deactivate accounts that breach these
          terms, engage in fraudulent transactions, or abuse our support agents.
        </p>
      </>
    ),
  },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="font-sans">
      {/* Hero Header Section */}
      <section className="relative flex min-h-[320px] items-center overflow-hidden border-b border-border bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950 text-white md:min-h-[360px]">
        {/* Ambient Blur Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center md:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs text-white/60 md:text-sm"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-white">Terms &amp; Conditions</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Terms &amp; <span className="text-accent-yellow">Conditions</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Please review our service agreement, publisher obligations, and buyer terms governing
            the Vefogix guest posting platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/80">
            <span>Last Updated: November 2026</span>
            <span className="h-1 w-1 rounded-full bg-accent-yellow" />
            <span>Effective Immediately</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all md:text-sm ${
                          isActive
                            ? "bg-primary-50 text-primary"
                            : "text-muted hover:bg-cream hover:text-fg"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-primary" : "text-muted group-hover:text-fg"
                            }`}
                          />
                          <span className="truncate">{sec.title}</span>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                            isActive ? "translate-x-0.5 text-primary" : "text-border"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Help Box */}
                <div className="mt-6 rounded-lg border border-border bg-cream/70 p-4">
                  <h4 className="text-xs font-semibold text-fg">Have questions about our terms?</h4>
                  <p className="mt-1 text-xs text-muted">
                    Our compliance and support team is ready to assist you.
                  </p>
                  <Link
                    to="/contact-us"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    <span>Contact Support</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Terms Articles */}
            <div className="space-y-8 lg:col-span-8">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="scroll-mt-24 rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:border-border/80 md:p-8"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-fg md:text-xl">{sec.title}</h2>
                    </div>

                    <div className="text-sm">{sec.content}</div>
                  </article>
                );
              })}

              {/* Bottom Acceptance Banner */}
              <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-fg">Ready to explore our marketplace?</h3>
                    <p className="mt-1 text-xs text-muted md:text-sm">
                      Access verified publishers or list your website with transparent pricing.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/marketplace"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark md:text-sm"
                    >
                      Browse Marketplace
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-fg transition hover:bg-cream md:text-sm"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditions;

