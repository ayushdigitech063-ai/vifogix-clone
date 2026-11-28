// src/services/packageManagerService.js
import api, {
  setAccessToken,
  setUserRole,
  refreshPackageManagerAccessToken,
} from "./api";

const toError = (error, fallback = "Package manager operation failed.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

export const packageManagerLogin = async ({ email, password }) => {
  try {
    const { data } = await api.post("v1/package/auth/login", { email, password });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.post("v1/auth/login", { email, password });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to sign in as package manager.");
      }
    }
    throw toError(error, "Failed to sign in as package manager.");
  }
};

export const refreshPackageManagerSession = refreshPackageManagerAccessToken;

export const packageManagerLogout = async () => {
  try {
    await api.post("v1/package/auth/logout");
  } catch {
    try {
      await api.post("v1/auth/logout");
    } catch {
      // ignore
    }
  } finally {
    setAccessToken(null);
    setUserRole(null);
  }
};

export const getPackageManagerPackages = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/package/packageList", { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get("/v1/package/packages", { params });
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch packages.");
      }
    }
    throw toError(error, "Failed to fetch packages.");
  }
};

export const getManagedPackage = async (slug) => {
  try {
    const { data } = await api.get(`/v1/package/get/${slug}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.get(`/v1/package/packages/${slug}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to fetch package details.");
      }
    }
    throw toError(error, "Failed to fetch package details.");
  }
};

export const createPackageManagerPackage = async (packageData) => {
  try {
    const { data } = await api.post("/v1/package/create", packageData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.post("/v1/package/create", packageData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to create package.");
      }
    }
    throw toError(error, "Failed to create package.");
  }
};

export const updatePackageManagerPackage = async (packageId, packageData) => {
  try {
    const { data } = await api.patch(`/v1/package/update/${packageId}`, packageData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/package/packages/${packageId}`, packageData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to update package.");
      }
    }
    throw toError(error, "Failed to update package.");
  }
};

export const changePackageManagerPackageStatus = async (packageId, statusData = {}) => {
  try {
    const { data } = await api.patch(`/v1/package/packages/${packageId}/status`, statusData);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.patch(`/v1/package/packages/${packageId}/status`, statusData);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to change package status.");
      }
    }
    throw toError(error, "Failed to change package status.");
  }
};

export const deletePackageManagerPackage = async (packageId) => {
  try {
    const { data } = await api.delete(`/v1/package/remove/${packageId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallback = await api.delete(`/v1/package/packages/${packageId}`);
        return fallback.data;
      } catch (err2) {
        throw toError(err2, "Failed to delete package.");
      }
    }
    throw toError(error, "Failed to delete package.");
  }
};

