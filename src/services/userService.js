// src/services/userService.js
import api from "./api";

const toError = (error, fallback = "User operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * List all users for admin
 * Maps to backend: router.get('/users', validate(listUsersQuerySchema), listAllUsers);
 * Endpoint: /v1/admin/users (with automatic fallback to /v1/users)
 *
 * @param {Object} params - { page, limit, search, role, status, isEmailVerified }
 * @returns {Promise<Object>}
 */
export const listAllUsers = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/admin/users", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/users", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch users list.");
      }
    }
    throw toError(error, "Failed to fetch users list.");
  }
};

/**
 * Get detailed user profile by userId
 * Maps to backend: router.get('/users/:userId', validate(userIdParamSchema), getUserDetails);
 * Endpoint: /v1/admin/users/:userId (with automatic fallback to /v1/users/:userId)
 *
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getUserDetails = async (userId) => {
  try {
    const { data } = await api.get(`/v1/admin/users/${userId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get(`/v1/users/${userId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch user details.");
      }
    }
    throw toError(error, "Failed to fetch user details.");
  }
};

/**
 * Update user status
 * Maps to backend: router.patch('/users/:userId/status', validate(updateUserStatusSchema), updateUserStatus);
 * Endpoint: /v1/admin/users/:userId/status (with fallback to /v1/users/:userId/status)
 *
 * @param {string} userId
 * @param {Object} statusData - { status, reason }
 * @returns {Promise<Object>}
 */
export const updateUserStatus = async (userId, statusData) => {
  try {
    const { data } = await api.patch(`/v1/admin/users/${userId}/status`, statusData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/users/${userId}/status`, statusData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to update user status.");
      }
    }
    throw toError(error, "Failed to update user status.");
  }
};

/**
 * Remove / Delete user
 * Maps to backend: router.delete('/users/:userId', validate(userIdParamSchema), removeUser);
 * Endpoint: /v1/admin/users/:userId (with fallback to /v1/users/:userId)
 *
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const removeUser = async (userId) => {
  try {
    const { data } = await api.delete(`/v1/admin/users/${userId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.delete(`/v1/users/${userId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to remove user.");
      }
    }
    throw toError(error, "Failed to remove user.");
  }
};
