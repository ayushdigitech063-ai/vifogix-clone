// src/services/api.js
import axios from "axios";

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send/receive the refresh-token cookie
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// One shared refresh request, however many callers ask at once
let refreshPromise = null;
export const refreshAccessToken = () => {
  refreshPromise ??= api
    .post("v1/admin/auth/refresh-token")
    .then(({ data }) => data)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

let refreshSellerPromise = null;
export const refreshSellerAccessToken = () => {
  refreshSellerPromise ??= api
    .post("v1/auth/seller/refresh-token")
    .then(({ data }) => data)
    .finally(() => {
      refreshSellerPromise = null;
    });
  return refreshSellerPromise;
};

let refreshBuyerPromise = null;
export const refreshBuyerAccessToken = () => {
  refreshBuyerPromise ??= api
    .post("v1/auth/buyer/refresh-token")
    .then(({ data }) => data)
    .finally(() => {
      refreshBuyerPromise = null;
    });
  return refreshBuyerPromise;
};

let refreshPackageManagerPromise = null;
export const refreshPackageManagerAccessToken = () => {
  refreshPackageManagerPromise ??= api
    .post("v1/package/auth/refresh-token")
    .then(({ data }) => data)
    .catch((err) => {
      if (err.response?.status === 404) {
        return api.post("v1/auth/refresh-token").then(({ data }) => data);
      }
      throw err;
    })
    .finally(() => {
      refreshPackageManagerPromise = null;
    });
  return refreshPackageManagerPromise;
};

let userRole = null;
export const setUserRole = (role) => {
  userRole = role ? String(role).toUpperCase() : null;
};
export const getUserRole = () => userRole;

// If the access token expired (401), refresh once and retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall =
      original?.url?.includes("v1/package/auth/refresh-token") ||
      original?.url?.includes("v1/auth/seller/refresh-token") ||
      original?.url?.includes("v1/auth/buyer/refresh-token") ||
      original?.url?.includes("v1/admin/auth/refresh-token") ||
      original?.url?.includes("v1/auth/refresh-token") ||
      original?.url?.includes("v1/auth/register") ||
      original?.url?.includes("v1/admin/auth/login")|| 
      original?.url?.includes("v1/package/auth/login")|| 
      original?.url?.includes("v1/auth/login");


    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const isPackageManagerCall =
          userRole === "PACKAGE_MANAGER" ||
          original?.url?.includes("/package/") ||
          original?.url?.includes("v1/package") ||
          window.location.pathname.startsWith("/package-manager");

        const isBuyerCall =
          userRole === "BUYER" ||
          original?.url?.includes("/buyer/") ||
          original?.url?.includes("v1/buyer") ||
          window.location.pathname.startsWith("/buyer-dashboard");

        const isSellerCall =
          userRole === "SELLER" ||
          original?.url?.includes("/seller/") ||
          original?.url?.includes("v1/seller") ||
          window.location.pathname.startsWith("/publisher-dashboard");

        let data;
        if (isPackageManagerCall) {
          data = await refreshPackageManagerAccessToken();
        } else if (isBuyerCall) {
          data = await refreshBuyerAccessToken();
        } else if (isSellerCall) {
          data = await refreshSellerAccessToken();
        } else {
          data = await refreshAccessToken();
        }

        const newAccessToken =
          data?.data?.accessToken || data?.accessToken || data?.data?.token;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          original.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;