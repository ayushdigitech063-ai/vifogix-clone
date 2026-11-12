// StatsStrip.jsx
import { stats } from "../../data/linkbuilding";

const StatsStrip = () => (
  <section className="border-b border-white/10 bg-navy-900">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-3 lg:grid-cols-6">
      {stats.map(({ value, label }) => (
        <div key={label} className="text-center">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-white/70">{label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsStrip;