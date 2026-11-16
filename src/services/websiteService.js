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
 * Uploads bulk website listings via CSV
 * Maps to backend: router.post('/websites/bulk-csv', uploadCsv.single('file'), uploadBulkCsvListings)
 *
 * @param {File} file - CSV file
 * @returns {Promise<Object>} Upload response data
 */
export const uploadBulkCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/v1/seller/websites/bulk-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw toError(error, "Failed to upload CSV file.");
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

/**
 * Fetches all websites for admin review with filtering & pagination
 * Maps to backend: router.get('/websites', validate(adminListWebsitesQuerySchema), getAllWebsitesForAdmin) -> /v1/admin/websites
 *
 * @param {Object} params - { page, limit, status, category, country, search, sellerId }
 * @returns {Promise<Object>}
 */
export const getAdminWebsites = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/admin/websites", { params });
    return data; // { success, statusCode, message, data: { websites, total, page, totalPages, summaryCounts } }
  } catch (error) {
    throw toError(error, "Failed to fetch admin websites list.");
  }
};

/**
 * Fetches single website details for admin
 * Maps to backend: router.get('/websites/:websiteId', validate(websiteIdParamSchema), getWebsiteDetailsForAdmin) -> /v1/admin/websites/:websiteId
 *
 * @param {string} websiteId
 * @returns {Promise<Object>}
 */
export const getAdminWebsiteDetail = async (websiteId) => {
  try {
    const { data } = await api.get(`/v1/admin/websites/${websiteId}`);
    return data; // { success, statusCode, message, data: website }
  } catch (error) {
    throw toError(error, "Failed to fetch website details.");
  }
};

/**
 * Review and verify / reject website listing by admin
 * Maps to backend: router.patch('/websites/:websiteId/review', validate(adminReviewWebsiteSchema), updateWebsiteVerificationStatus)
 *
 * @param {string} websiteId
 * @param {Object} reviewData - { status, adminReviewNotes, mozDA, ahrefsDR, semrushAS, monthlyTraffic, domainAge }
 * @returns {Promise<Object>}
 */
export const reviewWebsiteStatus = async (websiteId, reviewData) => {
  try {
    const { data } = await api.patch(`/v1/admin/websites/${websiteId}/review`, reviewData);
    return data;
  } catch (error) {
    throw toError(error, "Failed to update website status.");
  }
};

