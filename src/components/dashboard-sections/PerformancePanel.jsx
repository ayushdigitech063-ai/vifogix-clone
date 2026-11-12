import { BarChart3 } from "lucide-react";

const PerformancePanel = ({ series = [] }) => {
  const hasData = Array.isArray(series) && series.length > 0;
  const maxValue = hasData ? Math.max(...series.map((item) => item.value), 1) : 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-fg">Last 90 days</h2>
            <p className="text-xs text-muted mt-0.5">
              Orders and gig metrics for the last 90 days
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            90-day window
          </span>
        </div>

        {/* Content */}
        {hasData ? (
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              Combined stats
            </div>
            <div
              className="flex items-end gap-2 sm:gap-3 h-52 pt-8 pb-2 px-2 border-b border-border"
              role="img"
              aria-label={`Performance bar chart for last 90 days containing ${series.length} data points`}
            >
              {series.map((point, index) => {
                const heightPercent = Math.max(8, Math.round((point.value / maxValue) * 100));
                const isLatest = index === series.length - 1;

                return (
                  <div
                    key={point.label || index}
                    className="flex-1 flex flex-col items-center h-full justify-end group"
                  >
                    <div className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-medium">
                      {point.value}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                        isLatest
                          ? "bg-primary group-hover:bg-primary-light"
                          : "bg-primary/20 group-hover:bg-primary/40"
                      }`}
                      title={`${point.label}: ${point.value}`}
                    />
                    <span className="text-[10px] text-muted mt-2 truncate max-w-full">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-muted mb-3">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-fg">No 90-day stats yet</h3>
            <p className="text-xs text-muted mt-1 max-w-xs">
              Stats will appear after your first order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePanel;

