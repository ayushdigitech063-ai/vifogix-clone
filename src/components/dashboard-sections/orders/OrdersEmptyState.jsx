// src/components/dashboard-sections/orders/OrdersEmptyState.jsx
import { ShoppingBag, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersEmptyState = ({ isFiltered = false, onClearFilters }) => {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-muted">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-fg">No orders match your filters</h3>
        <p className="mt-1 max-w-md text-xs sm:text-sm text-muted">
          Try adjusting your search keyword, changing the order status, or extending the date range.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg hover:bg-cream transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-muted">
        <ShoppingBag className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-fg">No orders yet</h3>
      <p className="mt-1 max-w-md text-xs sm:text-sm text-muted">
        Orders from buyers will appear here once they purchase your guest posting packages.
      </p>
      <Link
        to="/publisher-dashboard/websites"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
      >
        <span>Go to My Websites</span>
      </Link>
    </div>
  );
};

export default OrdersEmptyState;

