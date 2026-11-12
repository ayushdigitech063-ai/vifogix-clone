import { Suspense, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div>
        <Navbar />
        <main>
          <Suspense fallback={<div className="p-10 text-center text-muted">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
