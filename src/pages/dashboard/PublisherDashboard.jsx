import { useDashboardStats } from "../../hooks/useDashboardStats";
import {
  DashboardHeader,
  KpiCards,
  PerformancePanel,
  EarningsPanel,
} from "../../components/dashboard-sections";

const PublisherDashboard = () => {
  const { user, stats, series, earnings } = useDashboardStats();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <DashboardHeader user={user} />
      <KpiCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformancePanel series={series} />
        </div>
        <div className="lg:col-span-1">
          <EarningsPanel earnings={earnings} />
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
