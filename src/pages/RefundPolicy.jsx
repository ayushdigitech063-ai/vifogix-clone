import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "1. Refund & Replacement Guarantee",
    icon: ShieldCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          At <span className="font-semibold text-fg">Sumit dev tech</span>, we prioritize delivering
          verified, quality publication placements. We provide a comprehensive{" "}
          <strong className="text-fg">100% Placement Guarantee</strong> to ensure confidence across all
          orders placed through our marketplace.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          If an order cannot be fulfilled in adherence with the publisher&apos;s advertised parameters
          or agreed content guidelines, you are entitled to a full credit refund, original payment
          reversal, or an equivalent replacement.
        </p>
      </>
    ),
  },
  {
    id: "eligible-scenarios",
    title: "2. Scenarios Eligible for a Full Refund",
    icon: CheckCircle2,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Buyers are fully covered and eligible for an immediate refund or replacement under the following conditions:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Missed Turnaround Time (TAT):</strong> The publisher fails
              to publish and submit the live link within the specified turnaround period.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Rejected Content:</strong> The publisher declines the
              editorial pitch or topic and no mutually agreed revision is established.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Attribute Mismatch:</strong> The published post violates
              pre-agreed parameters (e.g., changes a do-follow link to no-follow, marks sponsored tags
              contrary to listing promise, or changes the target URL).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Early Post Removal:</strong> A live link is removed or set to
              404 within the 12-month placement warranty period.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ineligible-scenarios",
    title: "3. Non-Refundable Situations",
    icon: AlertTriangle,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Refunds cannot be issued once an order has been successfully published in compliance with
          all stated order requirements. Specifically:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Requests for refunds based on buyer remorse after a link has already gone live on the
              publisher domain.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Third-party organic ranking fluctuations or algorithm adjustments outside the scope of
              contracted publication.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Delays resulting from incomplete content or delayed anchor text feedback from the buyer.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "claim-process",
    title: "4. Refund Claim Procedure",
    icon: RotateCcw,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Submitting a claim is straightforward and managed through your dashboard:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Navigate to <strong className="text-fg">Buyer Dashboard &gt; Orders</strong> and select
            the order in question.
          </li>
          <li>
            Click <strong className="text-fg">Request Revision or Refund</strong> before accepting the delivery.
          </li>
          <li>
            Specify the reason for the claim with relevant screenshots or URL inspection evidence.
          </li>
          <li>
            Our support moderation team reviews and arbitrates the dispute within 24–48 hours.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "processing-time",
    title: "5. Refund Disbursement Timeline",
    icon: Clock,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Once approved by platform mediation:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Platform Wallet Balance:</strong> Re-credited instantly and
              ready for allocation to an alternative publication.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Credit Card / Original Method:</strong> Returned to the
              cardholder within 5–7 business days depending on bank processing intervals.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "support-assistance",
    title: "6. Mediation & Support Assistance",
    icon: HelpCircle,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Our priority is fair, transparent resolutions for both buyers and publishers. If you experience
          any issues during order completion, our support team will actively mediate to find a solution.
        </p>
      </>
    ),
  },
];

const RefundPolicy = () => {
  const [activeTab, setActiveTab] = useState(sections[0].id);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-bg text-fg">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <RotateCcw className="h-3.5 w-3.5" />
              Customer Assurance
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl">
              Refund & Cancellation Policy
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Learn about our 100% money-back placement guarantee and our streamlined dispute resolution process.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <span>Last updated: November 2026</span>
              <span>•</span>
              <span>12-Month Link Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                  Policy Sections
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors md:text-sm ${
                        activeTab === sec.id
                          ? "bg-primary text-white"
                          : "text-fg hover:bg-cream hover:text-primary"
                      }`}
                    >
                      <span>{sec.title}</span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          activeTab === sec.id ? "rotate-90 text-white" : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </nav>

                <div className="mt-6 rounded-lg border border-border bg-cream/70 p-4">
                  <h4 className="text-xs font-semibold text-fg">Need help with an order?</h4>
                  <p className="mt-1 text-xs text-muted">
                    Submit an order review ticket and our resolutions team will assist.
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

            {/* Articles */}
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

              <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-fg">Have questions regarding payments?</h3>
                    <p className="mt-1 text-xs text-muted md:text-sm">
                      Check out our detailed Payment Terms and escrow protections.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/payment-terms"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark md:text-sm"
                    >
                      Payment Terms
                    </Link>
                    <Link
                      to="/terms-and-conditions"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-fg transition hover:bg-cream md:text-sm"
                    >
                      Terms & Conditions
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

export default RefundPolicy;
