// src/services/orderService.js
import { mockOrders } from "../data/orders";

/**
 * Filter and paginate orders.
 *
 * TODO: replace with api.get("/orders", { params })
 *
 * @param {Object} params
 * @param {number} params.page - 1-based page number
 * @param {number} params.pageSize - Items per page
 * @param {string} [params.search] - Search keyword (order ID, domain, package, buyer)
 * @param {string} [params.status] - Status filter ("ALL" or specific status)
 * @param {string} [params.range] - Date range ("all", "7d", "30d", "90d")
 * @returns {Promise<{ items: Array, total: number, page: number, pageSize: number, totalPages: number }>}
 */
export const getOrders = async ({
  page = 1,
  pageSize = 10,
  search = "",
  status = "ALL",
  range = "all",
} = {}) => {
  // Simulate network latency (300-400ms)
  await new Promise((resolve) => setTimeout(resolve, 350));

  let filtered = [...mockOrders];

  // 1. Status filter
  if (status && status !== "ALL") {
    filtered = filtered.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase()
    );
  }

  // 2. Search keyword filter
  const q = search.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((order) => {
      const idMatch = order.id.toLowerCase().includes(q);
      const domainMatch = order.domain.toLowerCase().includes(q);
      const packageMatch = order.packageName.toLowerCase().includes(q);
      const buyerMatch = order.buyer.toLowerCase().includes(q);
      return idMatch || domainMatch || packageMatch || buyerMatch;
    });
  }

  // 3. Date range filter based on order createdAt
  if (range && range !== "all") {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : null;
    if (days !== null) {
      // Calculate cutoff from reference point (November 12, 2026)
      const now = new Date("2026-11-12T12:00:00Z").getTime();
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((order) => {
        const orderTime = new Date(order.createdAt).getTime();
        return orderTime >= cutoff;
      });
    }
  }

  const total = filtered.length;
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);

  const startIndex = (safePage - 1) * safePageSize;
  const items = filtered.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
};

