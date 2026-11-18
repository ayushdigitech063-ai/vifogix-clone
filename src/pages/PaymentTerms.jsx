import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  ShieldCheck,
  Clock,
  Receipt,
  Scale,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "1. Payment Overview",
    icon: CreditCard,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          These Payment Terms govern all financial transactions, order checkouts, wallet balances,
          and publisher payouts on the <span className="font-semibold text-fg">Sumit dev tech</span> platform.
          By placing an order or listing a publication on our platform, you agree to comply with these terms.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          All monetary values across the marketplace are calculated and settled in United States
          Dollars (USD) unless explicitly stated otherwise.
        </p>
      </>
    ),
  },
  {
    id: "pricing-billing",
    title: "2. Order Pricing & Platform Fees",
    icon: DollarSign,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Pricing for guest posts, niche edits, link insertions, and press releases is set clearly
          on individual publication cards:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Transparent Pricing:</strong> The published checkout price
              includes editorial review, publication fees, and placement guarantees.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Processing Fees:</strong> A nominal platform processing fee
              may apply to cover payment gateway validation and automated compliance checks.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Custom Content Charges:</strong> When copywriting services
              are chosen, copywriting fees are added transparently to the itemized subtotal.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payment-methods",
    title: "3. Accepted Payment Methods",
    icon: Receipt,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We support trusted and compliant payment mechanisms for buyers across the globe:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Major Credit and Debit Cards (Visa, MasterCard, American Express).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Pre-funded Platform Wallet balance for instant order dispatch.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Bank wire / ACH transfers for high-volume enterprise and agency link accounts.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "escrow-protection",
    title: "4. Escrow & Publisher Payouts",
    icon: ShieldCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We operate a protected escrow mechanism for buyer security:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              When an order is created, payment is held securely in escrow by the platform until the
              publisher delivers a verified live placement URL.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Buyers receive a 48-hour inspection period to review the live post against order
              guidelines before funds are cleared to the publisher&apos;s earnings balance.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Publisher withdrawal requests are processed on verified schedule cycles (weekly or
              monthly) following statutory fraud verification.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "invoicing-taxes",
    title: "5. Invoicing, Taxes & Receipts",
    icon: Clock,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Digital receipts and itemized VAT/GST invoices are automatically generated upon payment
          clearance and made accessible within the Buyer Dashboard under Billing & Orders.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Buyers and publishers remain solely responsible for reporting and paying relevant taxes
          mandated by their respective local tax authorities.
        </p>
      </>
    ),
  },
  {
    id: "disputes-chargebacks",
    title: "6. Chargebacks & Payment Disputes",
    icon: Scale,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          In the event of an unfulfilled order or specification mismatch, users must first submit an
          in-platform revision request or contact customer support. Initiating an unauthorized payment
          chargeback without prior ticket submission constitutes a violation of these terms and may
          result in immediate account termination.
        </p>
      </>
    ),
  },
];

const PaymentTerms = () => {
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
      {/* Hero Header */}
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <CreditCard className="h-3.5 w-3.5" />
              Transactions & Billing
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl">
              Payment Terms
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Clear and transparent guidelines on marketplace pricing, order escrow, and publisher payouts.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <span>Last updated: November 2026</span>
              <span>•</span>
              <span>USD Settlements</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                  Terms Sections
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
                  <h4 className="text-xs font-semibold text-fg">Billing questions?</h4>
                  <p className="mt-1 text-xs text-muted">
                    Our accounts and billing specialists are available to assist.
                  </p>
                  <Link
                    to="/contact-us"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    <span>Contact Billing</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content Articles */}
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
                    <h3 className="text-base font-semibold text-fg">Explore our refund protections</h3>
                    <p className="mt-1 text-xs text-muted md:text-sm">
                      Read our 100% money-back placement guarantee.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/refund-policy"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark md:text-sm"
                    >
                      Refund Policy
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

export default PaymentTerms;
