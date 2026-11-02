// PricingSection.jsx
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../sheared/SectionHeading";
import { plans, singleLink } from "../../data/linkbuilding";

const PricingSection = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading
        eyebrow="Pricing"
        title="Affordable Link Building Packages With Transparent Pricing"
        description="Every plan includes a free SEO audit and 24/7 support. No setup fee. No contract."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col rounded-xl border bg-surface p-6 ${
              plan.featured ? "border-primary shadow-lg" : "border-border"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-accent-yellow px-3 py-0.5 text-xs font-bold text-fg">
                Most popular
              </span>
            )}
            <p className="text-sm font-bold uppercase tracking-wider text-muted">{plan.name}</p>
            <p className="mt-2 text-4xl font-bold text-fg">
              {plan.price}
              <span className="text-base font-medium text-muted">{plan.period}</span>
            </p>
            <p className="mt-1 text-sm text-muted">{plan.audience}</p>

            <ul className="my-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-fg">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                plan.featured
                  ? "bg-primary text-white hover:bg-primary-light"
                  : "border border-border text-fg hover:border-primary-light hover:text-primary"
              }`}
            >
              Get Started
            </a>
          </article>
        ))}
      </div>

      {/* Single link */}
      <div className="mt-10 flex flex-col items-start gap-6 rounded-xl border border-border bg-surface p-6 md:flex-row md:items-center md:p-8">
        <div className="rounded-xl bg-primary px-6 py-4 text-center text-white">
          <p className="text-3xl font-bold">{singleLink.price}</p>
          <p className="text-xs uppercase tracking-wide opacity-80">Starting price</p>
        </div>
        <div className="flex-1">
          <h3>{singleLink.title}</h3>
          <p className="mt-1 text-sm text-muted">{singleLink.description}</p>
        </div>
        <Link
          to="/marketplace"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Explore Marketplace
        </Link>
      </div>
      <p className="mt-4 text-center text-sm text-muted">{singleLink.bulk}</p>
    </div>
  </section>
);

export default PricingSection;