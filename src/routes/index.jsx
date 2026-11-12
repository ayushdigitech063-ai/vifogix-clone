// src/routes/index.jsx
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import GuestPosting from "../pages/GuestPosting";
import PressRelease from "../pages/PressRelease";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Blogs from "../pages/Blogs";
import About from "../pages/About";
import ContactUs from "../pages/Contact-us";
import TermsAndConditions from "../pages/TermsAndConditions";
import FaqSection from "../components/sheared/FaqSection";
import SellerProtectedRoute from "./SellerProtectedRoute";
import { adminRoutes } from "./AdminRoutes";

const Marketplace = lazy(() => import("../pages/Marketplace"));
const LinkBuilding = lazy(() => import("../pages/Linkbuilding"));
const WebsiteDetail = lazy(() => import("../pages/WebsiteDetail"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));

const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const PublisherDashboard = lazy(() => import("../pages/dashboard/PublisherDashboard"));
const BuyerDashboard = lazy(() => import("../pages/dashboard/BuyerDashboard"));
const BuyerProjects = lazy(() => import("../pages/dashboard/BuyerProjects"));
const BuyerWallet = lazy(() => import("../pages/dashboard/BuyerWallet"));
const DashboardOrders = lazy(() => import("../pages/dashboard/DashboardOrders"));
const DashboardOrderDetail = lazy(() => import("../pages/dashboard/DashboardOrderDetail"));
const DashboardGigs = lazy(() => import("../pages/dashboard/DashboardGigs"));
const DashboardEarnings = lazy(() => import("../pages/dashboard/DashboardEarnings"));
const AddWebsite = lazy(() => import("../pages/dashboard/AddWebsite"));
const WebsiteListing = lazy(() => import("../pages/dashboard/WebsiteListing"));
const CreateGig = lazy(() => import("../pages/dashboard/CreateGig"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "website/:slug", element: <WebsiteDetail /> },
      { path: "link-building-services", element: <LinkBuilding /> },
      { path: "guest-posting-services", element: <GuestPosting /> },
      { path: "press-release", element: <PressRelease /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:slug", element: <BlogDetail /> },
      { path: "about-us", element: <About /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "faqs", element: <FaqSection /> },
    ],
  },
  // TODO: protect this route group with auth
  {
    path: "/buyer-dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <BuyerDashboard /> },
      { path: "orders", element: <DashboardOrders /> },
      { path: "orders/:orderId", element: <DashboardOrderDetail /> },
      { path: "projects", element: <BuyerProjects /> },
      { path: "wallet", element: <BuyerWallet /> },
    ],
  },
  {
    path: "/publisher-dashboard",
    element: <SellerProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <PublisherDashboard /> },
          { path: "websites", element: <WebsiteListing /> },
          { path: "orders", element: <DashboardOrders /> },
          { path: "orders/:orderId", element: <DashboardOrderDetail /> },
          { path: "gigs", element: <DashboardGigs /> },
          { path: "earnings", element: <DashboardEarnings /> },
          { path: "websites/new", element: <AddWebsite /> },
          { path: "gigs/new", element: <CreateGig /> },
        ],
      },
    ],
  },
  ...adminRoutes,
]);
