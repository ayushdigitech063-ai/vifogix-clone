import { Star } from "lucide-react";
import KpiCard from "./KpiCard";

const formatPrice = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);

const KpiCards = ({ stats }) => {
  const cards = [
    {
      id: "net-income",
      label: "Net income",
      value: formatPrice(stats?.netIncome ?? 0),
      hint: "Total net income",
      accent: "primary",
    },
    {
      id: "total-orders",
      label: "Total orders",
      value: String(stats?.totalOrders ?? 0),
      hint: `${stats?.completedOrders ?? 0} completed orders`,
      accent: "accent-yellow",
    },
    {
      id: "gigs-listed",
      label: "Gigs listed",
      value: String(stats?.gigsListed ?? 0),
      hint: "Across all categories",
      accent: "primary",
    },
    {
      id: "avg-rating",
      label: "Avg rating",
      value: Number(stats?.avgRating ?? 0).toFixed(1),
      hint: `Based on ${stats?.totalReviews ?? 0} reviews`,
      accent: "accent-yellow",
      icon: (
        <Star className="h-4 w-4 fill-accent-yellow text-accent-yellow" aria-hidden="true" />
      ),
    },
    {
      id: "response-rate",
      label: "Order response rate",
      value: `${stats?.responseRate ?? 100}%`,
      hint: "Recent response activity",
      accent: "primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((c) => (
        <KpiCard
          key={c.id}
          label={c.label}
          value={c.value}
          hint={c.hint}
          icon={c.icon}
          accent={c.accent}
        />
      ))}
    </div>
  );
};

export default KpiCards;
