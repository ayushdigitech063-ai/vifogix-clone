// src/routes/PackageManagerProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const PackageManagerProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-xs font-medium text-slate-400">Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/package-manager/login" state={{ from: location }} replace />;
  }

  const role = (user.role || "").toUpperCase();
  const isAuthorized =
    role === "PACKAGE_MANAGER" ||
    role === "SUPER_ADMIN" ||
    role === "ADMIN";

  if (!isAuthorized) {
    return <Navigate to="/package-manager/login" replace />;
  }

  return <Outlet />;
};

export default PackageManagerProtectedRoute;

