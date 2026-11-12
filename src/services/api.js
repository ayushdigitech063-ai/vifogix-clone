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

// If the access token expired (401), refresh once and retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes("v1/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const data = await refreshAccessToken();
        setAccessToken(data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
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