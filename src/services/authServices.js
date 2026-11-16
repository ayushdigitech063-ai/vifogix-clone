import api, {
  refreshAccessToken,
  refreshSellerAccessToken,
  refreshBuyerAccessToken,
} from "./api";

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
export const refreshSellerSession = refreshSellerAccessToken;
export const refreshBuyerSession = refreshBuyerAccessToken;

export const logoutRequest = () => api.post("v1/admin/auth/logout");

/**
 * Logout seller
 * Backend endpoint: /v1/auth/seller/logout (clears seller_refreshToken cookie)
 */
export const logoutSellerRequest = () => api.post("v1/auth/seller/logout");

// logout buyer
export const logoutBuyerRequest = () => api.post("v1/auth/buyer/logout");

// login buyer and seller 

export const userLogin = async ({ email, password }) => {
  try {
    const { data } = await api.post("v1/auth/login", { email, password });
    return data; // { success, message, data: { user, accessToken } }
  } catch (error) {
    throw toError(error, "Failed to sign in.");
  }
};

/**
 * Fetch authenticated user profile
 * Backend endpoint: /v1/auth/profile
 */
export const getUserProfile = async () => {
  try {
    const { data } = await api.get("v1/auth/profile");
    return data; // { success, statusCode, message, data: { user } }
  } catch (error) {
    throw toError(error, "Failed to fetch profile.");
  }
};

export const getMyProfile = getUserProfile;

/**
 * Fetch authenticated admin profile
 * Backend endpoint: /v1/admin/profile
 */
export const getAdminProfile = async () => {
  try {
    const { data } = await api.get("v1/admin/profile");
    return data; // { success, statusCode, message, data: { user } }
  } catch (error) {
    throw toError(error, "Failed to fetch admin profile.");
  }
};


