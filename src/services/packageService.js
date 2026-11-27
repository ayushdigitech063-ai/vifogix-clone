// src/services/packageService.js
import api from "./api";

const toError = (error, fallback = "Package operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Fetch Public Packages
 * Maps to backend: router.use('/public', publicRoutes), router.get('/packages', listPublicPackages)
 * Endpoint: /v1/public/packages (with fallback to /v1/packages)
 *
 * @param {Object} params - { search }
 * @returns {Promise<Object>} { success, statusCode, message, data: { packages } }
 */
export const listPublicPackages = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/public/packages", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/packages", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch public packages.");
      }
    }
    throw toError(error, "Failed to fetch public packages.");
  }
};

/**
 * Fetch Single Public Package by slug
 * Endpoint: /v1/public/packages/:slug (with fallback to listPublicPackages lookup)
 *
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export const getPublicPackageBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/v1/public/packages/${slug}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const listRes = await listPublicPackages();
        const list =
          listRes?.data?.packages ||
          listRes?.data ||
          (Array.isArray(listRes) ? listRes : []);
        const found = Array.isArray(list)
          ? list.find((p) => p.slug === slug || p._id === slug || p.id === slug)
          : null;
        if (found) {
          return { success: true, data: found };
        }
      } catch (err2) {
        throw toError(err2, "Failed to fetch package details.");
      }
    }
    throw toError(error, "Failed to fetch package details.");
  }
};

/**
 * Calculate Public Package Price with Add-ons
 * Maps to backend: router.post('/packages/:slug/calculate-price', validate(calculatePackagePriceSchema), getCalculatedPackagePrice)
 * Endpoint: /v1/public/packages/:slug/calculate-price
 *
 * @param {string} slug
 * @param {Object} payload - { addons: [{ activityName, quantity }] }
 * @returns {Promise<Object>}
 */
export const calculatePublicPackagePrice = async (slug, payload = {}) => {
  try {
    const { data } = await api.post(`/v1/public/packages/${slug}/calculate-price`, payload);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.post(`/v1/packages/${slug}/calculate-price`, payload);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to calculate package price.");
      }
    }
    throw toError(error, "Failed to calculate package price.");
  }
};

/**
 * Fetch packages list for Admin
 * Maps to backend: GET /v1/admin/packages
 *
 * @param {Object} params - { page, limit, search, isActive }
 * @returns {Promise<Object>} { success, data: { packages, pagination } }
 */
export const getAdminPackages = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/admin/packages", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/packages", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch packages.");
      }
    }
    throw toError(error, "Failed to fetch packages.");
  }
};

/**
 * Create a new package
 * POST /v1/admin/packages
 *
 * @param {Object} packageData
 * @returns {Promise<Object>}
 */
export const createPackage = async (packageData) => {
  try {
    const { data } = await api.post("/v1/admin/packages", packageData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallback = await api.post("/v1/packages", packageData);
      return fallback.data;
    }
    throw toError(error, "Failed to create package.");
  }
};

/**
 * Update an existing package
 * PATCH /v1/admin/packages/:packageId
 *
 * @param {string} packageId
 * @param {Object} packageData
 * @returns {Promise<Object>}
 */
export const updatePackage = async (packageId, packageData) => {
  try {
    const { data } = await api.patch(`/v1/admin/packages/${packageId}`, packageData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallback = await api.patch(`/v1/packages/${packageId}`, packageData);
      return fallback.data;
    }
    throw toError(error, "Failed to update package.");
  }
};

/**
 * Change / Toggle package status
 * Maps to backend: router.patch('/packages/:packageId/status', validate(togglePackageStatusSchema), changePackageStatus)
 * Endpoint: /v1/admin/packages/:packageId/status (with fallback to /v1/packages/:packageId/status)
 *
 * @param {string} packageId
 * @param {Object} [statusData] - Optional body e.g. { isActive }
 * @returns {Promise<Object>}
 */
export const changePackageStatus = async (packageId, statusData = {}) => {
  try {
    const { data } = await api.patch(`/v1/admin/packages/${packageId}/review`, statusData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/packages/${packageId}/status`, statusData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to change package status.");
      }
    }
    throw toError(error, "Failed to change package status.");
  }
};


/**
 * Delete a package
 * DELETE /v1/admin/packages/:packageId
 *
 * @param {string} packageId
 * @returns {Promise<Object>}
 */
export const deletePackage = async (packageId) => {
  try {
    const { data } = await api.delete(`/v1/admin/packages/${packageId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallback = await api.delete(`/v1/packages/${packageId}`);
      return fallback.data;
    }
    throw toError(error, "Failed to delete package.");
  }
};
