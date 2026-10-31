// OutsourceSection.jsx
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { outsourcePoints } from "../../data/linkbuilding";

const OutsourceSection = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-light">Outsource</p>
        <h2>Build High-Quality Backlinks Around Your SEO Strategy</h2>
        <p className="mt-4 text-muted">
          A successful campaign isn't about getting more backlinks. It's about relevant
          placements that support your target pages, competitors and long-term goals.
        </p>
        <ul className="mt-6 space-y-3">
          {outsourcePoints.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-fg">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {p}
            </li>
          ))}
        </ul>
        <Link
          to="/marketplace"
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light"
        >
          Outsource Link Building Now
        </Link>
      </div>

      {/* Replace with a real dashboard screenshot later */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-muted">Top performing niches</p>
        {[["SaaS", 85], ["Finance", 72], ["Crypto", 64], ["Health", 48]].map(([niche, pct]) => (
          <div key={niche} className="mb-3">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-fg">{niche}</span>
              <span className="text-muted">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-background">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OutsourceSection;