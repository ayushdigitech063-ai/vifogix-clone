import api, { refreshAccessToken } from "./api";

// Turn axios errors into plain Errors with a readable message
const toError = (error, fallback) => {
  if (error.response?.data?.message) return new Error(error.response.data.message);
  if (error.request) return new Error("Cannot reach the server. Please try again.");
  return new Error(fallback);
};

export const adminLogin = async ({ email, password }) => {
  try {
    const { data } = await api.post("v1/admin/auth/login", { email, password });
    return data; // { success, message, data: { user, accessToken } }
  } catch (error) {
    throw toError(error, "Failed to sign in.");
  }
};

/**
 * Register a user (seller or buyer)
 * Backend endpoint: /v1/auth/register (relative to VITE_API_URL http://localhost:8000/api)
 */
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post("v1/auth/register", userData);
    return data; // { success, message, data: { user, accessToken } }
  } catch (error) {
    throw toError(error, "Failed to register account.");
  }
};

export const refreshSession = refreshAccessToken;

export const logoutRequest = () => api.post("v1/admin/auth/logout");
