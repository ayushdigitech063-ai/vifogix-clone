
import { Globe, Users, CheckCircle2, Clock } from "lucide-react";

const stats = [
  { icon: Globe, value: "127,494+", label: "Registered Websites" },
  { icon: Users, value: "10,000+", label: "Publishers & Writers" },
  { icon: CheckCircle2, value: "50,000+", label: "Tasks Completed" },
  { icon: Clock, value: "24 x 7", label: "Support" },
];
const StatsBar = () =>{
    return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-bold text-fg">{value}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsBar;