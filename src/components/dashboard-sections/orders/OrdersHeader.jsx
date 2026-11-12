// src/components/dashboard-sections/orders/OrdersHeader.jsx
import { ShoppingBag, RefreshCw } from "lucide-react";

const OrdersHeader = ({ onRefresh, isRefreshing = false }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Order Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted">
          Track and manage guest posting orders, deadlines and delivery status.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-fg hover:bg-cream transition-colors disabled:opacity-50"
          title="Refresh orders"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : "text-muted"}`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;

