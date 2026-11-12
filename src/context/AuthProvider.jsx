import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { adminLogin, registerUser, refreshSession, logoutRequest } from "../services/authServices";
import { setAccessToken } from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until the first session check finishes

  // Restore the session on page load: the in-memory token is gone after a refresh,
  // but the httpOnly cookie is still there.
  useEffect(() => {
    let cancelled = false;

    refreshSession()
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data?.data || res?.data || res;
        const token = payload?.accessToken || payload?.token;
        const loggedUser = payload?.user || payload?.admin || payload;

        if (token) setAccessToken(token);
        if (loggedUser) setUser(loggedUser);
      })
      .catch(() => {}) // not logged in, which is fine
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // the axios interceptor fires this when a refresh fails
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await adminLogin(credentials);
    const payload = res?.data?.data || res?.data || res;
    const token = payload?.accessToken || payload?.token;
    const loggedUser = payload?.user || payload?.admin || payload;

    if (token) setAccessToken(token);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await registerUser(userData);
    const payload = res?.data?.data || res?.data || res;
    const token = payload?.accessToken || payload?.token;
    const registeredUser = payload?.user || payload;

    if (token) setAccessToken(token);
    if (registeredUser) setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      admin: user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
