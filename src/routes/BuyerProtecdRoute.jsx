import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BuyerProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-10 text-center text-muted">Checking buyer session...</div>;
  }

  // Buyer must be authenticated and have a generated buyer/user ID
  const buyerId = user?._id || user?.id;
  const isBuyer =
    user?.role?.toUpperCase() === "BUYER" ||
    user?.role?.toLowerCase() === "buyer" ||
    Boolean(buyerId);

  if (!isAuthenticated || !buyerId || !isBuyer) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default BuyerProtectedRoute;

