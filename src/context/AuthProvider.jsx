import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  adminLogin,
  userLogin,
  registerUser,
  refreshSession,
  refreshSellerSession,
  refreshBuyerSession,
  logoutRequest,
  logoutSellerRequest,
  logoutBuyerRequest,
} from "../services/authServices";
import {
  refreshPackageManagerSession,
  packageManagerLogout,
} from "../services/packageManagerService";
import { setAccessToken, setUserRole } from "../services/api";

// Helper to safely parse user JWT claims (without external dependencies)
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until the first session check finishes

  // Sync role to API service whenever user state changes
  useEffect(() => {
    setUserRole(user?.role);
  }, [user]);

  // Restore the session on page load: the in-memory token is gone after a refresh,
  // but the httpOnly cookie is still there.
  useEffect(() => {
    let cancelled = false;

    // Check whether the user is visiting publisher (seller), buyer, package manager, or admin routes
    const isPublisherRoute = window.location.pathname.startsWith("/publisher-dashboard");
    const isBuyerRoute = window.location.pathname.startsWith("/buyer-dashboard");
    const isPackageManagerRoute = window.location.pathname.startsWith("/package-manager");
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    let refreshFn = refreshSession;
    if (isPackageManagerRoute) {
      refreshFn = refreshPackageManagerSession;
    } else if (isPublisherRoute) {
      refreshFn = refreshSellerSession;
    } else if (isBuyerRoute) {
      refreshFn = refreshBuyerSession;
    }

    refreshFn()
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data?.data || res?.data || res;
        const token = payload?.accessToken || payload?.token;

        // Backend returns only { accessToken }. Decode claims or recover stored user:
        const jwtClaims = token ? parseJwt(token) : null;
        const stored = getStoredUser();

        let loggedUser = payload?.user || payload?.admin || payload?.seller || payload?.buyer || payload?.packageManager;
        if (!loggedUser || (!loggedUser._id && !loggedUser.id)) {
          if (jwtClaims && (jwtClaims._id || jwtClaims.id)) {
            loggedUser = {
              _id: jwtClaims._id || jwtClaims.id,
              email: jwtClaims.email || stored?.email,
              role:
                jwtClaims.role ||
                stored?.role ||
                (isPackageManagerRoute ? "PACKAGE_MANAGER" : isPublisherRoute ? "SELLER" : isBuyerRoute ? "BUYER" : "USER"),
              name: stored?.name || "",
              ...stored,
            };
          } else if (stored) {
            loggedUser = stored;
          }
        }

        if (token) setAccessToken(token);
        if (loggedUser) {
          setUser(loggedUser);
          setUserRole(loggedUser.role);
          try {
            localStorage.setItem("user", JSON.stringify(loggedUser));
          } catch (err) {
            void err;
          }
        }
      })
      .catch(async () => {
        // Fallback: on public routes (e.g. marketplace, home), try buyer or seller if admin fails
        if (!cancelled && !isPublisherRoute && !isBuyerRoute && !isAdminRoute) {
          try {
            // First try buyer session
            const fallbackRes = await refreshBuyerSession();
            if (cancelled) return;
            const payload = fallbackRes?.data?.data || fallbackRes?.data || fallbackRes;
            const token = payload?.accessToken || payload?.token;
            const jwtClaims = token ? parseJwt(token) : null;
            const stored = getStoredUser();

            let loggedUser = payload?.user || payload?.buyer;
            if (!loggedUser || (!loggedUser._id && !loggedUser.id)) {
              if (jwtClaims && (jwtClaims._id || jwtClaims.id)) {
                loggedUser = {
                  _id: jwtClaims._id || jwtClaims.id,
                  email: jwtClaims.email || stored?.email,
                  role: jwtClaims.role || stored?.role || "BUYER",
                  name: stored?.name || "",
                  ...stored,
                };
              } else if (stored) {
                loggedUser = stored;
              }
            }

            if (token) setAccessToken(token);
            if (loggedUser) {
              setUser(loggedUser);
              setUserRole(loggedUser.role);
              try {
                localStorage.setItem("user", JSON.stringify(loggedUser));
              } catch (err) {
                void err;
              }
            }
          } catch {
            // Then try seller session if buyer is not logged in
            if (!cancelled) {
              try {
                const sellerRes = await refreshSellerSession();
                if (cancelled) return;
                const payload = sellerRes?.data?.data || sellerRes?.data || sellerRes;
                const token = payload?.accessToken || payload?.token;
                const jwtClaims = token ? parseJwt(token) : null;
                const stored = getStoredUser();

                let loggedUser = payload?.user || payload?.seller;
                if (!loggedUser || (!loggedUser._id && !loggedUser.id)) {
                  if (jwtClaims && (jwtClaims._id || jwtClaims.id)) {
                    loggedUser = {
                      _id: jwtClaims._id || jwtClaims.id,
                      email: jwtClaims.email || stored?.email,
                      role: jwtClaims.role || stored?.role || "SELLER",
                      name: stored?.name || "",
                      ...stored,
                    };
                  } else if (stored) {
                    loggedUser = stored;
                  }
                }

                if (token) setAccessToken(token);
                if (loggedUser) {
                  setUser(loggedUser);
                  setUserRole(loggedUser.role);
                  try {
                    localStorage.setItem("user", JSON.stringify(loggedUser));
                  } catch (err) {
                    void err;
                  }
                }
              } catch {
                // Not logged in to either
              }
            }
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // the axios interceptor fires this when a refresh fails
  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setUserRole(null);
      try {
        localStorage.removeItem("user");
      } catch (err) {
        void err;
      }
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    // If explicit admin credentials or admin route, invoke adminLogin; otherwise userLogin
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const res = isAdminRoute
      ? await adminLogin(credentials)
      : await userLogin(credentials);

    const payload = res?.data?.data || res?.data || res;
    const token = payload?.accessToken || payload?.token;
    const loggedUser = payload?.user || payload?.admin || payload;

    if (token) setAccessToken(token);
    setUser(loggedUser);
    setUserRole(loggedUser?.role || (isAdminRoute ? "ADMIN" : "SELLER"));
    if (loggedUser) {
      try {
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } catch (err) {
        void err;
      }
    }
    return loggedUser;
  }, []);

  const loginUserAccount = useCallback(async (credentials) => {
    const res = await userLogin(credentials);
    const payload = res?.data?.data || res?.data || res;
    const token = payload?.accessToken || payload?.token;
    const loggedUser = payload?.user || payload;

    if (token) setAccessToken(token);
    if (loggedUser) {
      setUser(loggedUser);
      setUserRole(loggedUser?.role);
      try {
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } catch (err) {
        void err;
      }
    }
    return loggedUser;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await registerUser(userData);
    const payload = res?.data?.data || res?.data || res;
    const token = payload?.accessToken || payload?.token;
    const registeredUser = payload?.user || payload;

    if (token) setAccessToken(token);
    if (registeredUser) {
      setUser(registeredUser);
      setUserRole(registeredUser.role || userData.role || "SELLER");
      try {
        localStorage.setItem("user", JSON.stringify(registeredUser));
      } catch (err) {
        void err;
      }
    }
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      const isPackageManager =
        user?.role?.toUpperCase() === "PACKAGE_MANAGER" ||
        window.location.pathname.startsWith("/package-manager");
      const isBuyer =
        user?.role?.toUpperCase() === "BUYER" ||
        window.location.pathname.startsWith("/buyer-dashboard");
      const isSeller =
        user?.role?.toUpperCase() === "SELLER" ||
        window.location.pathname.startsWith("/publisher-dashboard");

      if (isPackageManager) {
        await packageManagerLogout();
      } else if (isBuyer) {
        await logoutBuyerRequest();
      } else if (isSeller) {
        await logoutSellerRequest();
      } else {
        await logoutRequest();
      }
    } catch (err) {
      void err;
    } finally {
      setAccessToken(null);
      setUserRole(null);
      setUser(null);
      try {
        localStorage.removeItem("user");
      } catch (err) {
        void err;
      }
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      admin: user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      loginUserAccount,
      register,
      logout,
    }),
    [user, isLoading, login, loginUserAccount, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
