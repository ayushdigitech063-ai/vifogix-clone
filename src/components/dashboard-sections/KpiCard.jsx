const KpiCard = ({ label, value, hint, icon: Icon, accent = "primary" }) => {
  const accentBorder =
    accent === "accent-yellow" ? "border-l-accent-yellow" : "border-l-primary";

  return (
    <div
      className={`rounded-xl border border-border bg-surface p-4 border-l-4 ${accentBorder} shadow-xs flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted">{label}</span>
          {Icon && <span className="text-muted">{Icon}</span>}
        </div>
        <div className="mt-2 text-2xl font-bold text-fg tracking-tight">
          {value}
        </div>
      </div>
      <div className="mt-3 text-xs text-muted">
        {hint}
      </div>
    </div>
  );
};

export default KpiCard;

