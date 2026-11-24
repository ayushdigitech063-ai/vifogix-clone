import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Cookie,
  UserCheck,
  Share2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "1. Overview & Commitment",
    icon: ShieldCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          At <span className="font-semibold text-fg">Sumit dev tech</span>, we take the confidentiality
          and security of your personal and business data seriously. This Privacy Policy details how we
          collect, process, store, and protect your information when you use our marketplace,
          services, and publisher tools.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          By accessing or registering on our platform, you consent to the information collection and
          usage practices outlined in this policy. If you do not agree with any practices described
          herein, please refrain from using our services.
        </p>
      </>
    ),
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    icon: Database,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We collect personal and transactional data to deliver seamless marketplace interactions,
          secure order processing, and authenticated account management:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Account Information:</strong> Name, business email,
              contact phone number, organization size, and chosen password upon signup.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Publisher Data:</strong> Website domain URLs, publication
              metrics (DA, DR, organic traffic), niche categories, and payout preferences.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Buyer & Order Data:</strong> Target URLs, anchor texts,
              content requirements, order histories, and invoice billing records.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Technical Telemetry:</strong> IP addresses, browser
              fingerprints, device parameters, and usage logs to prevent platform fraud.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "use-of-information",
    title: "3. How We Use Your Information",
    icon: Eye,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          The information we collect is utilized strictly for legitimate business operations and service delivery:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Facilitating order fulfillment between verified publishers and buyers.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Authenticating sessions, preventing malicious access, and stopping fraudulent listings.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Sending critical transaction notices, order status alerts, and invoice confirmations.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Improving site responsiveness, platform usability, and search relevancy.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-tracking",
    title: "4. Cookies & Session Management",
    icon: Cookie,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We use secure, <span className="font-semibold text-fg">httpOnly</span> cookies and local
          storage tokens to maintain persistent authentication sessions for buyers, sellers, and
          administrators. These cookies protect authentication tokens against cross-site scripting
          (XSS) vulnerabilities.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          You may modify cookie preferences through browser settings; however, disabling essential
          authentication cookies will prevent you from accessing protected dashboards and managing orders.
        </p>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "5. Information Sharing & Third Parties",
    icon: Share2,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We do <strong className="text-fg">not sell, rent, or monetize</strong> your personal data.
          Data is only shared under explicit operational scopes:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Order Participants:</strong> Essential order details
              (target URL, anchor text, content brief) are disclosed to the matched publisher for placement.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Infrastructure Providers:</strong> Encrypted hosting,
              payment gateway processing, and automated transactional email relays.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="text-fg">Legal Compliance:</strong> If required by valid court order,
              subpoena, or applicable regulatory mandates.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-security",
    title: "6. Data Security & Storage",
    icon: Lock,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          We apply industry-standard security protocols, including TLS 1.3 encryption in transit,
          hashed passwords using salted bcrypt algorithms, and restricted least-privilege administrative
          access to databases.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          While we implement robust defenses, no Internet transmission is 100% immune from compromise.
          Users are responsible for safeguarding their login credentials and reporting suspicious activity promptly.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "7. Your Data Rights & Choices",
    icon: UserCheck,
    content: (
      <>
        <p className="leading-relaxed text-muted">
          Depending on your jurisdiction (such as GDPR or CCPA guidelines), you hold rights regarding
          your personal data:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>The right to access and review your personal profile and historical transactions.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>The right to request rectification of incomplete or inaccurate records.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>The right to request account deletion and removal of non-statutory data records.</span>
          </li>
        </ul>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
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
      {/* Hero Banner */}
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy & Data Protection
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Learn how Sumit dev tech collects, uses, and safeguards your business and personal information.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <span>Last updated: November 2026</span>
              <span>•</span>
              <span>Version 2.0</span>
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

                {/* Support Box */}
                <div className="mt-6 rounded-lg border border-border bg-cream/70 p-4">
                  <h4 className="text-xs font-semibold text-fg">Questions about privacy?</h4>
                  <p className="mt-1 text-xs text-muted">
                    Our data protection officer is available for any inquiries.
                  </p>
                  <Link
                    to="/contact-us"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark"
                  >
                    <span>Contact Privacy Team</span>
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

              {/* Bottom Card */}
              <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-fg">Have questions or requests?</h3>
                    <p className="mt-1 text-xs text-muted md:text-sm">
                      Submit a data inquiry or review our platform terms and conditions.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/terms-and-conditions"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-fg transition hover:bg-cream md:text-sm"
                    >
                      Terms and Conditions
                    </Link>
                    <Link
                      to="/contact-us"
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark md:text-sm"
                    >
                      Contact Us
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

export default PrivacyPolicy;
