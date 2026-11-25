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

// --------------------------------------------------
// Helper: safely parse JWT payload
// --------------------------------------------------
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          (c) =>
            "%" +
            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// --------------------------------------------------
// Get previously stored user
// --------------------------------------------------
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// --------------------------------------------------
// Auth Provider
// --------------------------------------------------
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------------------------------------
  // Keep API service role in sync with current user
  // ------------------------------------------------
  useEffect(() => {
    setUserRole(user?.role || null);
  }, [user]);

  // ------------------------------------------------
  // Restore authentication session on page load
  // ------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const pathname = window.location.pathname;

      // --------------------------------------------
      // Detect protected application areas
      // --------------------------------------------
      const isAdminRoute =
        pathname.startsWith("/admin");

      const isSellerRoute =
        pathname.startsWith("/publisher-dashboard");

      const isBuyerRoute =
        pathname.startsWith("/buyer-dashboard");

      const isPackageManagerRoute =
        pathname.startsWith("/package-manager");

      // --------------------------------------------
      // IMPORTANT:
      // Public routes do NOT need refresh API.
      //
      // Example:
      // /
      // /products
      // /packages
      // /about
      //
      // Don't call admin/buyer/seller/package-manager
      // refresh APIs on these routes.
      // --------------------------------------------
     const isPublicRoute =
  !isAdminRoute &&
  !isSellerRoute &&
  !isBuyerRoute &&
  !isPackageManagerRoute;

let refreshFn = null;

// Homepage should try to restore BUYER session
if (pathname === "/") {
  refreshFn = refreshBuyerSession;
} else if (isAdminRoute) {
  refreshFn = refreshSession;
} else if (isSellerRoute) {
  refreshFn = refreshSellerSession;
} else if (isBuyerRoute) {
  refreshFn = refreshBuyerSession;
} else if (isPackageManagerRoute) {
  refreshFn = refreshPackageManagerSession;
}

// Other public routes don't need refresh
if (!refreshFn && isPublicRoute) {
  if (!cancelled) {
    setIsLoading(false);
  }

  return;
}

      try {
        // ------------------------------------------
        // Restore existing authenticated session
        // ------------------------------------------
        const res = await refreshFn();

        if (cancelled) return;

        const payload =
          res?.data?.data ||
          res?.data ||
          res;

        const token =
          payload?.accessToken ||
          payload?.token;

        // ------------------------------------------
        // Try to get user from API response
        // ------------------------------------------
        let loggedUser =
          payload?.user ||
          payload?.admin ||
          payload?.seller ||
          payload?.buyer ||
          payload?.packageManager;

        // ------------------------------------------
        // Stored user is only fallback identity data.
        // It should NOT override trusted JWT/API data.
        // ------------------------------------------
        const stored = getStoredUser();

        // ------------------------------------------
        // Decode JWT if backend only returns token
        // ------------------------------------------
        const jwtClaims = token
          ? parseJwt(token)
          : null;

        if (
          !loggedUser ||
          (!loggedUser._id && !loggedUser.id)
        ) {
          if (
            jwtClaims &&
            (jwtClaims._id || jwtClaims.id)
          ) {
            loggedUser = {
              ...stored,

              _id:
                jwtClaims._id ||
                jwtClaims.id,

              email:
                jwtClaims.email ||
                stored?.email,

              role:
                jwtClaims.role ||
                stored?.role ||
                getRoleFromRoute({
                  isAdminRoute,
                  isSellerRoute,
                  isBuyerRoute,
                  isPackageManagerRoute,
                }),

              name:
                jwtClaims.name ||
                stored?.name ||
                "",
            };
          } else if (stored) {
            loggedUser = stored;
          }
        }

        // ------------------------------------------
        // Save new access token
        // ------------------------------------------
        if (token) {
          setAccessToken(token);
        }

        // ------------------------------------------
        // Update React authentication state
        // ------------------------------------------
        if (loggedUser) {
          setUser(loggedUser);

          setUserRole(
            loggedUser.role ||
              getRoleFromRoute({
                isAdminRoute,
                isSellerRoute,
                isBuyerRoute,
                isPackageManagerRoute,
              })
          );

          try {
            localStorage.setItem(
              "user",
              JSON.stringify(loggedUser)
            );
          } catch (err) {
            void err;
          }
        }
      } catch (error) {
        // ------------------------------------------
        // IMPORTANT:
        // A refresh failure on a protected route
        // means session could not be restored.
        //
        // Do NOT try another role's refresh API.
        // ------------------------------------------

        if (!cancelled) {
          setUser(null);
          setUserRole(null);

          setAccessToken(null);

          try {
            localStorage.removeItem("user");
          } catch (err) {
            void err;
          }

          console.error(
            "Failed to restore authentication session:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------------
  // Handle logout event fired by Axios interceptor
  // ------------------------------------------------
  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setUserRole(null);
      setAccessToken(null);

      try {
        localStorage.removeItem("user");
      } catch (err) {
        void err;
      }
    };

    window.addEventListener(
      "auth:logout",
      onLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        onLogout
      );
    };
  }, []);

  // ------------------------------------------------
  // Normal login
  // ------------------------------------------------
  const login = useCallback(async (credentials) => {
    const pathname = window.location.pathname;

    const isAdminRoute =
      pathname.startsWith("/admin");

    const res = isAdminRoute
      ? await adminLogin(credentials)
      : await userLogin(credentials);

    const payload =
      res?.data?.data ||
      res?.data ||
      res;

    const token =
      payload?.accessToken ||
      payload?.token;

    const loggedUser =
      payload?.user ||
      payload?.admin ||
      payload;

    if (token) {
      setAccessToken(token);
    }

    if (loggedUser) {
      const role =
        loggedUser.role ||
        (isAdminRoute
          ? "ADMIN"
          : "SELLER");

      const finalUser = {
        ...loggedUser,
        role,
      };

      setUser(finalUser);
      setUserRole(role);

      try {
        localStorage.setItem(
          "user",
          JSON.stringify(finalUser)
        );
      } catch (err) {
        void err;
      }

      return finalUser;
    }

    return null;
  }, []);

  // ------------------------------------------------
  // Buyer/user login
  // ------------------------------------------------
  const loginUserAccount = useCallback(
    async (credentials) => {
      const res = await userLogin(credentials);

      const payload =
        res?.data?.data ||
        res?.data ||
        res;

      const token =
        payload?.accessToken ||
        payload?.token;

      const loggedUser =
        payload?.user ||
        payload;

      if (token) {
        setAccessToken(token);
      }

      if (loggedUser) {
        setUser(loggedUser);
        setUserRole(loggedUser.role);

        try {
          localStorage.setItem(
            "user",
            JSON.stringify(loggedUser)
          );
        } catch (err) {
          void err;
        }
      }

      return loggedUser;
    },
    []
  );

  // ------------------------------------------------
  // Register
  // ------------------------------------------------
  const register = useCallback(
    async (userData) => {
      const res =
        await registerUser(userData);

      const payload =
        res?.data?.data ||
        res?.data ||
        res;

      const token =
        payload?.accessToken ||
        payload?.token;

      const registeredUser =
        payload?.user ||
        payload;

      if (token) {
        setAccessToken(token);
      }

      if (registeredUser) {
        const role =
          registeredUser.role ||
          userData.role ||
          "SELLER";

        const finalUser = {
          ...registeredUser,
          role,
        };

        setUser(finalUser);
        setUserRole(role);

        try {
          localStorage.setItem(
            "user",
            JSON.stringify(finalUser)
          );
        } catch (err) {
          void err;
        }

        return finalUser;
      }

      return null;
    },
    []
  );

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------
  const logout = useCallback(async () => {
    try {
      const currentRole =
        user?.role?.toUpperCase();

      const pathname =
        window.location.pathname;

      const isPackageManager =
        currentRole === "PACKAGE_MANAGER" ||
        pathname.startsWith(
          "/package-manager"
        );

      const isBuyer =
        currentRole === "BUYER" ||
        pathname.startsWith(
          "/buyer-dashboard"
        );

      const isSeller =
        currentRole === "SELLER" ||
        pathname.startsWith(
          "/publisher-dashboard"
        );

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

  // ------------------------------------------------
  // Context value
  // ------------------------------------------------
  const value = useMemo(
    () => ({
      user,

      // Existing compatibility
      admin: user,

      isLoading,

      isAuthenticated:
        Boolean(user),

      login,
      loginUserAccount,
      register,
      logout,
    }),
    [
      user,
      isLoading,
      login,
      loginUserAccount,
      register,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// Route → role fallback
// --------------------------------------------------
const getRoleFromRoute = ({
  isAdminRoute,
  isSellerRoute,
  isBuyerRoute,
  isPackageManagerRoute,
}) => {
  if (isAdminRoute) {
    return "ADMIN";
  }

  if (isSellerRoute) {
    return "SELLER";
  }

  if (isBuyerRoute) {
    return "BUYER";
  }

  if (isPackageManagerRoute) {
    return "PACKAGE_MANAGER";
  }

  return null;
};

export default AuthProvider;