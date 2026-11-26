import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistProvider";

const App = () => {
const pathname = window.location.pathname;
const isAdminOrPackageManager = 
  pathname.startsWith("/admin") || 
  pathname.startsWith("/package-manager");
if (!isAdminOrPackageManager) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </ToastProvider>
  );
} else {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
};

export default App;
