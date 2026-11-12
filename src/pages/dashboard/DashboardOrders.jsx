// src/pages/dashboard/DashboardOrders.jsx
import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import useOrders from "../../hooks/useOrders";
import { PAGE_SIZE_OPTIONS } from "../../data/orders";
import {
  OrdersHeader,
  OrdersFilters,
  OrdersTable,
  OrdersTableSkeleton,
  OrdersEmptyState,
  OrdersPagination,
} from "../../components/dashboard-sections/orders";

const DashboardOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  const listCardRef = useRef(null);

  // 1. Sanitize query params from URL
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const rawPageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "ALL";
  const rangeParam = searchParams.get("range") || "all";

  const sanitizedPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const sanitizedPageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize)
    ? rawPageSize
    : 10;

  // Helper function to update search parameters and sanitize defaults
  const updateUrlParams = useCallback(
    (newParams = {}) => {
      startTransition(() => {
        setSearchParams(
          (prev) => {
            const updated = new URLSearchParams(prev);

            Object.entries(newParams).forEach(([key, value]) => {
              if (
                value === null ||
                value === undefined ||
                value === "" ||
                (key === "page" && Number(value) === 1) ||
                (key === "pageSize" && Number(value) === 10) ||
                (key === "status" && value === "ALL") ||
                (key === "range" && value === "all")
              ) {
                updated.delete(key);
              } else {
                updated.set(key, String(value));
              }
            });

            return updated;
          },
          { replace: false }
        );
      });
    },
    [setSearchParams]
  );

  // 2. Debounced local search input state tracking URL query changes
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const [searchInput, setSearchInput] = useState(searchParam);

  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setSearchInput(searchParam);
  }

  // Debounce search update to URL (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== searchParam) {
        updateUrlParams({ search: trimmed, page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, searchParam, updateUrlParams]);

  // 3. Fetch orders hook
  const {
    orders,
    total,
    totalPages,
    isLoading,
    isRefreshing,
    error,
    refetch,
  } = useOrders({
    page: sanitizedPage,
    pageSize: sanitizedPageSize,
    search: searchParam,
    status: statusParam,
    range: rangeParam,
  });

  // Clamp page if beyond totalPages (e.g., ?page=999)
  const isOutOfBounds = !isLoading && totalPages > 0 && sanitizedPage > totalPages;
  useEffect(() => {
    if (isOutOfBounds) {
      updateUrlParams({ page: totalPages });
    }
  }, [isOutOfBounds, totalPages, updateUrlParams]);

  // Handlers for filter controls
  const handleStatusChange = (newStatus) => {
    updateUrlParams({ status: newStatus, page: 1 });
  };

  const handleRangeChange = (newRange) => {
    updateUrlParams({ range: newRange, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
    if (listCardRef.current) {
      listCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    updateUrlParams({ pageSize: newPageSize, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      setSearchParams(new URLSearchParams(), { replace: false });
    });
  };

  const isFiltered = Boolean(
    searchParam || (statusParam && statusParam !== "ALL") || (rangeParam && rangeParam !== "all")
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-fade-in">
      {/* 1. Page Header */}
      <OrdersHeader onRefresh={refetch} isRefreshing={isRefreshing} />

      {/* 2. Filter Card */}
      <OrdersFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        status={statusParam}
        onStatusChange={handleStatusChange}
        range={rangeParam}
        onRangeChange={handleRangeChange}
      />

      {/* 3. List Card */}
      <div
        ref={listCardRef}
        className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden scroll-mt-20"
      >
        {isLoading ? (
          <OrdersTableSkeleton rows={sanitizedPageSize} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <AlertCircle className="h-8 w-8 text-accent-red mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-fg">Failed to load orders</p>
            <p className="text-xs text-muted mt-1 max-w-sm">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-light transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <OrdersEmptyState
            isFiltered={isFiltered}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            <OrdersTable orders={orders} />
            <OrdersPagination
              page={sanitizedPage}
              pageSize={sanitizedPageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
