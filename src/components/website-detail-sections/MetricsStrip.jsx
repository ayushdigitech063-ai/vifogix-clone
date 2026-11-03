const MetricsStrip = ({ site }) => {
  const dr = site.dr || 0;
  const da = site.da || 0;
  const asScore = site.as || 0;

  // Traffic display (handle string or object from different data shapes)
  const trafficVal =
    typeof site.traffic === "object"
      ? site.traffic?.ahrefs || site.traffic?.semrush || "—"
      : site.traffic || "—";

  const metrics = [
    { label: "Domain Rating", short: "DR", value: dr, isBar: true },
    { label: "Domain Authority", short: "DA", value: da, isBar: true },
    { label: "Authority Score", short: "AS", value: asScore, isBar: true },
    { label: "Monthly Traffic", short: "Ahrefs", value: trafficVal, isBar: false },
  ];

  return (
    <div className="relative z-20 mx-auto -mt-12 max-w-7xl px-4">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-lg md:p-7">
        <div className="grid grid-cols-2 gap-4 divide-y divide-border sm:divide-y-0 sm:divide-x md:grid-cols-4 md:gap-6">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`flex flex-col justify-between ${idx > 0 ? "pt-4 sm:pt-0 sm:pl-4 md:pl-6" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">{m.label}</span>
                  <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    {m.short}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-fg md:text-3xl">
                  {m.value}
                </p>
              </div>

              {m.isBar ? (
                <div className="mt-3">
                  <div
                    role="progressbar"
                    aria-valuenow={m.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`${m.label} score`}
                    className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                  >
                    <div
                      style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
                      className="h-full rounded-full bg-primary transition-all duration-500"
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[11px] font-medium text-gray-400">
                  Organic search estimates
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsStrip;

