// src/hooks/useOrders.js
import { useState, useEffect, useCallback, useRef } from "react";
import { getOrders } from "../services/orderService";

/**
 * Custom hook to query and manage orders with stale-response protection
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.search
 * @param {string} params.status
 * @param {string} params.range
 */
const useOrders = ({
  page = 1,
  pageSize = 10,
  search = "",
  status = "ALL",
  range = "all",
} = {}) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Track latest request ID to drop stale responses
  const requestIdRef = useRef(0);

  const fetchOrders = useCallback(
    async (isManualRefresh = false) => {
      const currentRequestId = ++requestIdRef.current;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getOrders({
          page,
          pageSize,
          search,
          status,
          range,
        });

        // Only update state if this request is still the most current one
        if (currentRequestId === requestIdRef.current) {
          setOrders(result.items);
          setTotal(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || "Failed to load orders. Please try again.");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [page, pageSize, search, status, range]
  );

  useEffect(() => {
    let ignore = false;
    const currentRequestId = ++requestIdRef.current;

    getOrders({ page, pageSize, search, status, range })
      .then((result) => {
        if (!ignore && currentRequestId === requestIdRef.current) {
          setOrders(result.items);
          setTotal(result.total);
          setTotalPages(result.totalPages);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore && currentRequestId === requestIdRef.current) {
          setError(err.message || "Failed to load orders. Please try again.");
        }
      })
      .finally(() => {
        if (!ignore && currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      requestIdRef.current += 1;
    };
  }, [page, pageSize, search, status, range]);

  const refetch = useCallback(() => {
    return fetchOrders(true);
  }, [fetchOrders]);

  return {
    orders,
    total,
    totalPages,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
};

export default useOrders;
