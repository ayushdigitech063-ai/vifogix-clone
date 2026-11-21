// src/services/settingService.js
import api from "./api";

const toError = (error, fallback = "Setting operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Get Footer settings
 * GET /v1/admin/footer or GET /v1/public/footer or fallback
 *
 * @returns {Promise<Object>}
 */
export const getFooterSettings = async () => {
  try {
    const { data } = await api.patch("/v1/admin/footer");
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/footer");
        return fallback.data;
      } catch (err2) {
        if (err2.response?.status === 404) {
          const publicFallback = await api.get("/v1/public/footer");
          return publicFallback.data;
        }
        throw toError(err2, "Failed to fetch footer settings.");
      }
    }
    throw toError(error, "Failed to fetch footer settings.");
  }
};

/**
 * Update / Modify Footer settings
 * Maps to backend: router.patch('/footer', validate(updateFooterSchema), modifyFooter);
 * Endpoint: PATCH /v1/admin/footer or fallback /v1/footer
 *
 * @param {Object} footerData
 * @returns {Promise<Object>}
 */
export const modifyFooter = async (footerData) => {
  try {
    const { data } = await api.patch("/v1/admin/footer", footerData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch("/v1/footer", footerData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to update footer settings.");
      }
    }
    throw toError(error, "Failed to update footer settings.");
  }
};
