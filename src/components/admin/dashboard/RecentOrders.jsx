import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-5 md:px-6">
        <div>
          <h2 className="text-lg font-bold text-fg">Recent Orders</h2>
          <p className="text-xs text-gray-500">Latest transactions across all services</p>
        </div>
        <Link
          to="/admin/orders"
          className="text-xs font-semibold text-primary transition-colors hover:underline"
        >
          View all orders &rarr;
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm text-fg">
          <thead className="border-b border-border bg-gray-50/60 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Order ID</th>
              <th className="px-6 py-3.5 font-semibold">Customer</th>
              <th className="px-6 py-3.5 font-semibold">Service</th>
              <th className="px-6 py-3.5 font-semibold">Amount</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono text-xs font-medium text-fg">
                  {order.id}
                </td>
                <td className="px-6 py-4 font-medium text-fg">{order.customer}</td>
                <td className="px-6 py-4 text-gray-500">{order.service}</td>
                <td className="px-6 py-4 font-semibold text-fg">
                  {formatCurrency(order.amount)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(order.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="divide-y divide-border md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-fg">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-sm font-semibold text-fg">{order.customer}</div>
            <div className="text-xs text-gray-500">{order.service}</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold text-fg">{formatCurrency(order.amount)}</span>
              <span className="text-xs text-gray-500">{formatDate(order.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;

