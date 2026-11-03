// HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { heroHighlights, heroPerks, reviewPlatforms } from "../../data/linkbuilding";
import BannerHeading from "../sheared/BannerHeading";

const HeroVisual = () => (
  <div className="rounded-2xl border border-white/10 bg-navy-950/80 p-6 shadow-xl backdrop-blur-sm">
    <p className="mb-4 text-sm font-semibold text-white/70">Campaign performance</p>
    <div className="space-y-3">
      {[
        ["finance-blog.com", "DR 72", "Live"],
        ["techdaily.io", "DR 65", "Live"],
        ["growthmag.net", "DR 58", "In review"],
      ].map(([site, dr, status]) => (
        <div key={site} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span className="font-medium text-white">{site}</span>
          <span className="text-white/70">{dr}</span>
          <span className={status === "Live" ? "font-semibold text-accent-yellow" : "font-medium text-white/60"}>
            {status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HeroSection = () => (
  <section className="relative flex min-h-[560px] items-center border-b border-border bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950 text-white">
    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:py-24">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white">
          <Star className="h-4 w-4" /> Trusted by 5,000+ brands across 150+ countries
        </p>

        <BannerHeading tone="dark"
          as="h1"
          align="left"
          maxWidth="2xl"
          className="mt-5"
          title="Professional Link Building for"
          highlight="SEO Growth"
          description="Strategic link building tailored to your SEO goals, niche, competitors and budget—from research to reporting."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {heroHighlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-medium text-white/90">
              <Icon className="h-5 w-5 shrink-0 text-primary" /> {text}
            </li>
          ))}
        </ul>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {heroPerks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-fg">
              <Icon className="h-4 w-4 text-primary" /> {text}
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
        </div>
      </div>

      <HeroVisual />
    </div>
  </section>
);

export default HeroSection;
