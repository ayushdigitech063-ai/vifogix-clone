// src/components/dashboard-sections/orders/OrdersFilters.jsx
import { Search } from "lucide-react";
import { ORDER_STATUSES, DATE_RANGES } from "../../../data/orders";

const OrdersFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <label htmlFor="orders-search" className="sr-only">
            Search orders
          </label>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
            <Search className="h-4 w-4" aria-hidden="true" />
          </span>
          <input
            id="orders-search"
            type="text"
            placeholder="Search by order ID, website or buyer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-cream/30 pl-10 pr-4 text-xs sm:text-sm text-fg outline-none transition focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Select */}
        <div>
          <label htmlFor="orders-status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="orders-status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {ORDER_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Select */}
        <div>
          <label htmlFor="orders-range-filter" className="sr-only">
            Filter by date range
          </label>
          <select
            id="orders-range-filter"
            value={range}
            onChange={(e) => onRangeChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {DATE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilters;

