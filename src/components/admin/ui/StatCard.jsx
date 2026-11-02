import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ label, value, change, trend = "up", note }) => {
  const isUp = trend === "up";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-accent-red"
            }`}
          >
            {isUp ? (
              <ArrowUp className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-2xl font-bold tracking-tight text-fg md:text-3xl">{value}</p>
      </div>

      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
};

export default StatCard;

