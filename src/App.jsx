import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistProvider";

const App = () => {
  return (
    <ToastProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </ToastProvider>
  );
};

export default App;
