// src/services/wishlistService.js
import api from "./api";

const toError = (error, fallback = "Wishlist operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Toggle Website in Wishlist (Add if not present, Remove if present)
 * Maps to backend: POST /v1/wishlist/toggle
 *
 * @param {string} websiteId - 24-character hexadecimal MongoDB ObjectId
 * @returns {Promise<Object>} { success, statusCode, message, data: { websiteId, isWishlisted, action } }
 */
export const toggleWishlist = async (websiteId) => {
  try {
    const { data } = await api.post("/v1/wishlist/toggle", { websiteId });
    return data;
  } catch (error) {
    throw toError(error, "Failed to toggle wishlist item.");
  }
};

/**
 * Get Buyer's Full Wishlisted Websites with pagination
 * Maps to backend: GET /v1/wishlist
 *
 * @param {Object} params - { page, limit }
 * @returns {Promise<Object>} { success, statusCode, message, data: { websites, pagination } }
 */
export const getMyWishlist = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/wishlist", { params });
    return data;
  } catch (error) {
    throw toError(error, "Failed to fetch wishlist.");
  }
};

/**
 * Get Buyer's Wishlisted Website IDs array
 * Maps to backend: GET /v1/wishlist/ids
 *
 * @returns {Promise<Array<string>>} List of website IDs
 */
export const getMyWishlistedIds = async () => {
  try {
    const { data } = await api.get("/v1/wishlist/ids");
    return data?.data?.websiteIds || [];
  } catch (error) {
    throw toError(error, "Failed to fetch wishlisted IDs.");
  }
};

/**
 * Remove specific website from Wishlist
 * Maps to backend: DELETE /v1/wishlist/:websiteId
 *
 * @param {string} websiteId
 * @returns {Promise<Object>}
 */
export const removeFromWishlist = async (websiteId) => {
  try {
    const { data } = await api.delete(`/v1/wishlist/${websiteId}`);
    return data;
  } catch (error) {
    throw toError(error, "Failed to remove website from wishlist.");
  }
};
