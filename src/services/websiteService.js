// src/services/websiteService.js
import api from "./api";

// Turn axios errors into readable Error objects
const toError = (error, fallback = "Something went wrong.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Creates a single website listing
 * Maps to backend: router.post('/websites', validate(addWebsiteSchema), createSingleListing)
 *
 * @param {Object} websiteData - Payload matching websiteSchema
 * @returns {Promise<Object>} Created website response data
 */
export const createSingleListing = async (websiteData) => {
  try {
    const { data } = await api.post("/v1/seller/websites", websiteData);
    return data;
  } catch (error) {
    throw toError(error, "Failed to submit website listing.");
  }
};

/**
 * Fetches seller website listings with optional query parameters
 * Maps to backend: router.get('/websites', getMyListings) -> http://localhost:8000/api/v1/seller/websites
 *
 * @param {Object} params - Query parameters: { page, limit, status, category, country, search }
 * @returns {Promise<Object>} Retrieved listings data object
 */
export const getSellerWebsites = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/seller/websites", { params });
    return data; // { success, statusCode, message, data }
  } catch (error) {
    throw toError(error, "Failed to fetch website listings.");
  }
};
