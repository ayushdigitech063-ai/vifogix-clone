const MetricsBreakdown = ({ site }) => {
  const dr = site.dr || 0;
  const da = site.da || 0;
  const asScore = site.as || 0;

  const trafficVal =
    typeof site.traffic === "object"
      ? site.traffic?.ahrefs || site.traffic?.semrush || "—"
      : site.traffic || "—";

  const backlinksVal =
    typeof site.backlinks === "object"
      ? `${site.backlinks?.followed || 0} followed / ${site.backlinks?.noFollowed || 0} nofollow`
      : site.backlinks || "—";

  const items = [
    {
      label: "Traffic (Ahrefs)",
      value: trafficVal,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: "Backlinks Total",
      value: backlinksVal,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      label: "Domain Rating (DR)",
      value: `${dr} / 100`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
    },
    {
      label: "Domain Authority (DA)",
      value: `${da} / 100`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Authority Score (AS)",
      value: `${asScore} / 100`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <section id="metrics" className="scroll-mt-36 rounded-2xl border border-border bg-white p-6 shadow-xs">
      <div className="border-b border-border pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">SEO Metrics</span>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl">
          Authority & traffic
        </h2>
      </div>

      {/* Grid of labelled rows */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center justify-between rounded-xl border border-border bg-gray-50/50 p-3.5"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium text-gray-500">
              <span className="text-primary">{it.icon}</span>
              <span>{it.label}</span>
            </div>
            <span className="text-sm font-bold text-fg">{it.value}</span>
          </div>
        ))}
      </div>

      {/* CSS-only Comparison Bar Visual */}
      <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Authority Score Comparison (out of 100)
        </h3>

        <div
          role="img"
          aria-label={`Comparison chart: Domain Rating ${dr}, Domain Authority ${da}, Authority Score ${asScore}`}
          className="mt-4 space-y-3"
        >
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="text-gray-600">DR (Domain Rating)</span>
              <span className="text-fg">{dr} / 100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                style={{ width: `${Math.min(100, Math.max(0, dr))}%` }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="text-gray-600">DA (Domain Authority)</span>
              <span className="text-fg">{da} / 100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                style={{ width: `${Math.min(100, Math.max(0, da))}%` }}
                className="h-full rounded-full bg-accent-yellow"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="text-gray-600">AS (Authority Score)</span>
              <span className="text-fg">{asScore} / 100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                style={{ width: `${Math.min(100, Math.max(0, asScore))}%` }}
                className="h-full rounded-full bg-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsBreakdown;

