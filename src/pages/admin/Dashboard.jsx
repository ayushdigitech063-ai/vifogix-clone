import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import StatsGrid from "../../components/admin/dashboard/StatsGrid";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import { stats, recentOrders, quickActions, monthlyOrders } from "../../data/admin/dashboard";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const Dashboard = () => {
  const { admin } = useAdminAuth();
  const adminFirstName = admin?.name ? admin.name.split(" ")[0] : "Admin";

  const maxOrderValue = Math.max(...monthlyOrders, 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${adminFirstName}! Here is a summary of your platform activity.`}
        actions={
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New blog post</span>
          </Link>
        }
      />

      {/* Stats Cards */}
      <StatsGrid stats={stats} />

      {/* Row: Orders Overview Chart (2/3) + Quick Actions (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Orders Overview Chart */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:col-span-2 md:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold text-fg md:text-lg">Orders overview</h2>
              <p className="text-xs text-gray-500">Monthly order volume over the last 6 months</p>
            </div>
            <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-gray-600">
              Last 6 Months
            </span>
          </div>

          {/* Accessible Bar Chart */}
          <div className="mt-6">
            <div
              className="flex h-52 items-end justify-between gap-3 pt-6 md:gap-6"
              role="img"
              aria-label="Bar chart showing monthly orders: May 42, June 58, July 70, August 65, September 84, October 98"
            >
              {monthlyOrders.map((val, idx) => {
                const heightPercent = Math.round((val / maxOrderValue) * 100);
                return (
                  <div key={months[idx]} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-500">{val}</span>
                    <div className="relative flex h-36 w-full max-w-[48px] items-end justify-center rounded-t-lg bg-cream/70">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-primary transition-all duration-500 hover:bg-primary-light"
                        title={`${months[idx]}: ${val} orders`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{months[idx]}</span>
                  </div>
                );
              })}
            </div>

            {/* Visually hidden data table for screen readers */}
            <table className="sr-only">
              <caption>Monthly Orders Overview</caption>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {monthlyOrders.map((val, idx) => (
                  <tr key={months[idx]}>
                    <td>{months[idx]}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-base font-bold text-fg md:text-lg">Quick actions</h2>
            <p className="text-xs text-gray-500">Frequently used administrative actions</p>
          </div>

          <div className="mt-4 space-y-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="group flex items-center justify-between rounded-xl border border-border bg-cream/30 p-3.5 text-xs font-semibold text-fg transition-all hover:border-primary hover:bg-white hover:shadow-xs"
              >
                <span>{action.label}</span>
                <ChevronRight
                  className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
};

export default Dashboard;
