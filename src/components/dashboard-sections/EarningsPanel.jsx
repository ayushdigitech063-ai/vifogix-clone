import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";

const formatPrice = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);

const iconsMap = {
  completed: CheckCircle2,
  pending: Clock,
  escrow: ShieldAlert,
};

const EarningsPanel = ({ earnings = [] }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-fg">Earnings breakdown</h2>
          <p className="text-xs text-muted mt-0.5">Order earnings by status</p>
        </div>

        {/* Breakdown Rows */}
        <div className="divide-y divide-border">
          {earnings.map((row) => {
            const IconComponent = iconsMap[row.key] || Clock;
            return (
              <div key={row.key} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-primary">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-fg">{row.label}</div>
                    <div className="text-xs text-muted">{row.hint}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-fg">
                  {formatPrice(row.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EarningsPanel;
