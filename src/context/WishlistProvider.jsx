// src/context/WishlistProvider.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { WishlistContext } from "./WishlistContext.js";
import { useAuth } from "../hooks/useAuth";
import { getMyWishlistedIds, toggleWishlist as apiToggleWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../services/wishlistService";

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const isBuyer = isAuthenticated && user?.role?.toUpperCase() !== "SELLER";

  // Fetch wishlisted website IDs when authenticated as buyer
  const refreshWishlist = useCallback(async () => {
    if (!isBuyer) {
      setWishlistIds([]);
      return;
    }
    try {
      setLoading(true);
      const ids = await getMyWishlistedIds();
      setWishlistIds(Array.isArray(ids) ? ids : []);
    } catch {
      // Keep silent on background count sync failure
    } finally {
      setLoading(false);
    }
  }, [isBuyer]);

  useEffect(() => {
    let active = true;
    if (!isBuyer) {
      return;
    }
    getMyWishlistedIds()
      .then((ids) => {
        if (active) {
          setWishlistIds(Array.isArray(ids) ? ids : []);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isBuyer]);

  const toggleItem = useCallback(async (websiteId) => {
    const res = await apiToggleWishlist(websiteId);
    const isNowWishlisted = res?.data?.isWishlisted;
    setWishlistIds((prev) => {
      const exists = prev.includes(websiteId);
      if (isNowWishlisted ?? !exists) {
        return exists ? prev : [...prev, websiteId];
      } else {
        return prev.filter((id) => id !== websiteId);
      }
    });
    return res;
  }, []);

  const removeItem = useCallback(async (websiteId) => {
    const res = await apiRemoveFromWishlist(websiteId);
    setWishlistIds((prev) => prev.filter((id) => id !== websiteId));
    return res;
  }, []);

  const value = useMemo(() => ({
    wishlistIds,
    wishlistCount: wishlistIds.length,
    loading,
    refreshWishlist,
    toggleItem,
    removeItem,
    isWishlisted: (id) => wishlistIds.includes(id),
  }), [wishlistIds, loading, refreshWishlist, toggleItem, removeItem]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
