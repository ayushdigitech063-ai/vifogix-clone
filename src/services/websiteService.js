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
 * Fetch Public Marketplace Website Listings
 * Maps to backend: router.get('/marketplace', validate(listWebsitesQuerySchema), getMarketplaceListings) -> /v1/seller/marketplace
 *
 * @param {Object} params - { page, limit, category, subCategory, country, search }
 * @returns {Promise<Object>} { websites, pagination: { total, page, limit, totalPages } }
 */
export const getMarketplaceWebsites = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/public/marketplace", { params });
    return data; // { success, statusCode, message, data: { websites, pagination } }
  } catch (error) {
    throw toError(error, "Failed to fetch marketplace websites.");
  }
};

/**
 * Fetch Public Single Website Details by websiteId
 * Maps to backend: router.use('/public', publicRoutes), router.get('/marketplace/:websiteId', validate(websiteIdParamSchema), getPublicWebsiteDetails)
 * Full URL: /v1/public/marketplace/:websiteId
 *
 * @param {string} websiteId
 * @returns {Promise<Object>} { success, statusCode, message, data: website }
 */
export const getPublicWebsiteDetails = async (websiteSlug) => {
  try {
    const { data } = await api.get(`/v1/public/marketplace/${websiteSlug}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get(`/v1/marketplace/${websiteSlug}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch website details.");
      }
    }
    throw toError(error, "Failed to fetch website details.");
  }
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
 * Fetch Main Categories List
 * Maps to backend: router.get('/categories', getMainCategories) -> /v1/seller/categories
 *
 * @returns {Promise<Array<string>>}
 */
export const getMainCategories = async () => {
  try {
    const { data } = await api.get("/v1/seller/categories");
    return data?.data?.categories || [];
  } catch (error) {
    throw toError(error, "Failed to load categories.");
  }
};

/**
 * Fetch Subcategories for a given category
 * Maps to backend: router.get('/subcategories', validate(getSubCategoriesQuerySchema), getSubCategoriesByCategory) -> /v1/seller/subcategories?category={category}
 *
 * @param {string} category - Category name
 * @returns {Promise<Array<string>>}
 */
export const getSubCategoriesByCategory = async (category) => {
  try {
    if (!category) return [];
    const { data } = await api.get("/v1/seller/subcategories", {
      params: { category },
    });
    return data?.data?.subCategories || [];
  } catch (error) {
    throw toError(error, "Failed to load subcategories.");
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
 * Fetches single seller website details by slug
 * Maps to backend: router.get('/websites/:slug', validate(websiteSlugParamSchema), getMyWebsiteDetails) -> /v1/seller/websites/:slug
 *
 * @param {string} slug - Website slug
 * @returns {Promise<Object>} { success, statusCode, message, data: website }
 */
export const getMyWebsiteDetails = async (slug) => {
  try {
    const { data } = await api.get(`/v1/seller/websites/${slug}`);
    return data;
  } catch (error) {
    throw toError(error, "Failed to fetch website details.");
  }
};

/**
 * Updates a seller website listing by slug
 * Maps to backend: router.patch('/websites/:slug', validate(updateWebsiteSchema), updateMyListing) -> /v1/seller/websites/:slug
 *
 * @param {string} slug - Website slug
 * @param {Object} websiteData - Partial or full website update payload
 * @returns {Promise<Object>} Updated website response data
 */
export const updateMyListing = async (slug, websiteData) => {
  try {
    const { data } = await api.patch(`/v1/seller/websites/${slug}`, websiteData);
    return data;
  } catch (error) {
    throw toError(error, "Failed to update website listing.");
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

