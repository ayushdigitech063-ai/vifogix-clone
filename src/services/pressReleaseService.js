// src/services/pressReleaseService.js
import api from "./api";

const toError = (error, fallback = "Press release operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Add / Create a new Press Release
 * Maps to backend: router.post('/press-releases', validate(createPressReleaseSchema), addPressRelease);
 * Endpoint: /v1/seller/press-releases or /v1/press-releases
 *
 * @param {Object} prData
 * @returns {Promise<Object>}
 */
export const addPressRelease = async (prData) => {
  try {
    const { data } = await api.post("/v1/seller/press-releases", prData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.post("/v1/press-releases", prData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to submit press release.");
      }
    }
    throw toError(error, "Failed to submit press release.");
  }
};

/**
 * Fetch seller's own press releases listing
 * Maps to backend: router.get('/press-releases', getMyPressReleases);
 * Endpoint: /v1/seller/press-releases or /v1/press-releases
 *
 * @param {Object} params - { page, limit, search, status, category }
 * @returns {Promise<Object>}
 */
export const getMyPressReleases = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/seller/press-releases", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/press-releases", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch press releases.");
      }
    }
    throw toError(error, "Failed to fetch press releases.");
  }
};

/**
 * Get single press release detail by ID
 * Maps to backend: router.get('/press-releases/:prId', validate(prIdParamSchema), getMyPressReleaseById);
 *
 * @param {string} prId
 * @returns {Promise<Object>}
 */
export const getMyPressReleaseById = async (prId) => {
  try {
    const { data } = await api.get(`/v1/seller/press-releases/${prId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get(`/v1/press-releases/${prId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch press release details.");
      }
    }
    throw toError(error, "Failed to fetch press release details.");
  }
};

/**
 * Update seller's press release
 * Maps to backend: router.patch('/press-releases/:prId', validate(updatePressReleaseSchema), updateMyPressRelease);
 *
 * @param {string} prId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export const updateMyPressRelease = async (prId, updateData) => {
  try {
    const { data } = await api.patch(`/v1/seller/press-releases/${prId}`, updateData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/press-releases/${prId}`, updateData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to update press release.");
      }
    }
    throw toError(error, "Failed to update press release.");
  }
};

/**
 * Delete seller's press release
 * Maps to backend: router.delete('/press-releases/:prId', validate(prIdParamSchema), deleteMyPressRelease);
 *
 * @param {string} prId
 * @returns {Promise<Object>}
 */
export const deleteMyPressRelease = async (prId) => {
  try {
    const { data } = await api.delete(`/v1/seller/press-releases/${prId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.delete(`/v1/press-releases/${prId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to delete press release.");
      }
    }
    throw toError(error, "Failed to delete press release.");
  }
};

/**
 * Fetch all press releases for Admin
 * Maps to backend: router.get('/press-releases', getAllPressReleasesAdmin);
 * Endpoint: /v1/admin/press-releases
 *
 * @param {Object} params - { page, limit, search, status, category }
 * @returns {Promise<Object>}
 */
export const getAllPressReleasesAdmin = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/admin/press-releases", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/press-releases/admin", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch admin press releases.");
      }
    }
    throw toError(error, "Failed to fetch admin press releases.");
  }
};

/**
 * Get single press release detail for Admin by ID
 * Maps to backend: router.get('/press-releases/:prId', validate(prIdParamSchema), getPressReleaseByIdAdmin);
 * Endpoint: /v1/admin/press-releases/:prId
 *
 * @param {string} prId
 * @returns {Promise<Object>}
 */
export const getPressReleaseByIdAdmin = async (prId) => {
  try {
    const { data } = await api.get(`/v1/admin/press-releases/${prId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get(`/v1/press-releases/admin/${prId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch press release details.");
      }
    }
    throw toError(error, "Failed to fetch press release details.");
  }
};

/**
 * Review / Approve / Reject / Suspend Press Release
 * Maps to backend: router.patch('/press-releases/:prId/status', validate(reviewPressReleaseStatusSchema), reviewPressReleaseStatus);
 * Endpoint: /v1/admin/press-releases/:prId/status
 *
 * @param {string} prId
 * @param {Object} reviewData - { status: 'ACTIVE' | 'REJECTED' | 'SUSPENDED', adminReviewNotes }
 * @returns {Promise<Object>}
 */
export const reviewPressReleaseStatus = async (prId, reviewData) => {
  try {
    const { data } = await api.patch(`/v1/admin/press-releases/${prId}/status`, reviewData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/admin/press-releases/${prId}/status`, reviewData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to review press release status.");
      }
    }
    throw toError(error, "Failed to review press release status.");
  }
};

