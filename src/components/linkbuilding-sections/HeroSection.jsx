// HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { heroHighlights, heroPerks, reviewPlatforms } from "../../data/linkbuilding";
import BannerHeading from "../sheared/BannerHeading";

const HeroVisual = () => (
  <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
    <p className="mb-4 text-sm font-semibold text-muted">Campaign performance</p>
    <div className="space-y-3">
      {[
        ["finance-blog.com", "DR 72", "Live"],
        ["techdaily.io", "DR 65", "Live"],
        ["growthmag.net", "DR 58", "In review"],
      ].map(([site, dr, status]) => (
        <div key={site} className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <span className="font-medium text-fg">{site}</span>
          <span className="text-muted">{dr}</span>
          <span className={status === "Live" ? "font-semibold text-primary" : "text-accent-yellow"}>
            {status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HeroSection = () => (
  <section className="border-b border-border bg-surface">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <Star className="h-4 w-4" /> Trusted by 5,000+ brands across 150+ countries
        </p>

        <BannerHeading
          as="h1"
          align="left"
          maxWidth="full"
          className="mt-5"
          title="Professional Link Building Services for"
          highlight="Sustainable SEO Growth"
          description="Strategic link building built around your SEO goals, target pages, competitors, niche and budget. We handle research, outreach, content, placement and reporting."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {heroHighlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-medium text-fg">
              <Icon className="h-5 w-5 shrink-0 text-primary" /> {text}
            </li>
          ))}
        </ul>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {heroPerks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-muted">
              <Icon className="h-4 w-4 text-accent-yellow" /> {text}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light"
          >
            Get a Custom Strategy <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/marketplace"
            className="rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-fg hover:border-primary-light hover:text-primary"
          >
            Browse Marketplace
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span>400+ SEO agencies trust us</span>
          <span>Rated 4.8 on Trustpilot</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <span className="text-muted">Verified on:</span>
          {reviewPlatforms.map((p) => (
            <span key={p} className="font-semibold text-fg/70">{p}</span>
          ))}
        </div>
      </div>

      <HeroVisual />
    </div>
  </section>
);

export default HeroSection;
