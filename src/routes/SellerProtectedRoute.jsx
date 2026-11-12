import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SellerProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-10 text-center text-muted">Checking seller session...</div>;
  }

  // Seller must be authenticated and have a generated seller/user ID
  const sellerId = user?._id || user?.id;
  const isSeller =
    user?.role?.toUpperCase() === "SELLER" ||
    user?.role?.toLowerCase() === "seller" ||
    Boolean(sellerId);

  if (!isAuthenticated || !sellerId || !isSeller) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default SellerProtectedRoute;

