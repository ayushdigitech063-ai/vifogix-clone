import { useSyncExternalStore } from "react";
import { ADMIN_STORAGE_KEY, DEMO_ADMIN } from "../utils/adminConstants";

let currentAdmin = (() => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to read admin session from localStorage", err);
    return null;
  }
})();

const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => currentAdmin;

export const useAdminAuth = () => {
  const admin = useSyncExternalStore(subscribe, getSnapshot);
  const isAuthenticated = Boolean(admin);

  const login = async (email, password) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (
      email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() &&
      password === DEMO_ADMIN.password
    ) {
      const session = {
        email: DEMO_ADMIN.email,
        name: DEMO_ADMIN.name,
        role: DEMO_ADMIN.role,
        signedInAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      } catch (err) {
        console.error("Failed to store admin session", err);
      }
      currentAdmin = session;
      notify();
      return session;
    }

    throw new Error("Invalid email or password.");
  };

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear admin session", err);
    }
    currentAdmin = null;
    notify();
  };

  return {
    admin,
    isAuthenticated,
    login,
    logout,
  };
};

