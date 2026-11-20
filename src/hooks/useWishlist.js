// src/hooks/useWishlist.js
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext.js";

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlistIds: [],
      wishlistCount: 0,
      loading: false,
      refreshWishlist: () => {},
      toggleItem: async () => {},
      removeItem: async () => {},
      isWishlisted: () => false,
    };
  }
  return context;
};
