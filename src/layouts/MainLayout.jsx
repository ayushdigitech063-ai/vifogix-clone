import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const MainLayout = () =>{
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
}
export default MainLayout;