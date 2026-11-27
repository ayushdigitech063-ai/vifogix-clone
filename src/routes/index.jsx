// src/routes/index.jsx
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/publicPages/Home";
import GuestPosting from "../pages/publicPages/GuestPosting";
import PressRelease from "../pages/publicPages/PressRelease";
import SignIn from "../pages/publicPages/SignIn";
import SignUp from "../pages/publicPages/SignUp";
import Blogs from "../pages/publicPages/Blogs";
import About from "../pages/publicPages/About";
import ContactUs from "../pages/publicPages/Contact-us";
import TermsAndConditions from "../pages/publicPages/TermsAndConditions";
import FaqSection from "../components/sheared/FaqSection";
import SellerProtectedRoute from "./SellerProtectedRoute";
import { adminRoutes } from "./AdminRoutes";
import { packageManagerRoutes } from "./PackageManagerRoutes";
import BuyerProtectedRoute from "./BuyerProtecdRoute";

const Marketplace = lazy(() => import("../pages/publicPages/Marketplace"));
const LinkBuilding = lazy(() => import("../pages/publicPages/Linkbuilding"));
const LinkBuildingPackageDetail = lazy(() => import("../components/linkbuilding-sections/PackageDetail"));
const WebsiteDetail = lazy(() => import("../pages/publicPages/WebsiteDetail"));
const PressReleaseDetail = lazy(() => import("../pages/publicPages/PressReleaseDetail"));
const BlogDetail = lazy(() => import("../pages/publicPages/BlogDetail"));
const Wishlist = lazy(() => import("../pages/publicPages/Wishlist"));
const Cart = lazy(() => import("../pages/publicPages/Cart"));
const PrivacyPolicy = lazy(() => import("../pages/publicPages/PrivacyPolicy"));
const PaymentTerms = lazy(() => import("../pages/publicPages/PaymentTerms"));
const RefundPolicy = lazy(() => import("../pages/publicPages/RefundPolicy"));

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
const PublisherWebsiteDetail = lazy(() => import("../pages/dashboard/WebsiteDetail"));
const PressReleaseListing = lazy(() => import("../pages/dashboard/PressReleaseListing"));
const CreateGig = lazy(() => import("../pages/dashboard/CreateGig"));
const Profile = lazy(() => import("../pages/dashboard/Profile"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "website/:slug", element: <WebsiteDetail /> },
      { path: "link-building-services", element: <LinkBuilding /> },
      { path: "link-building-services/:slug", element: <LinkBuildingPackageDetail /> },
      { path: "guest-posting-services", element: <GuestPosting /> },
      { path: "press-release", element: <PressRelease /> },
      { path: "press-release/:id", element: <PressReleaseDetail /> },
      { path: "press-release/package/:id", element: <PressReleaseDetail /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blogs/:slug", element: <BlogDetail /> },
      { path: "about-us", element: <About /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "payment-terms", element: <PaymentTerms /> },
      { path: "refund-policy", element: <RefundPolicy /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "faqs", element: <FaqSection /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "cart", element: <Cart /> },
    ],
  },
  // TODO: protect this route group with auth
  {
    path: "/buyer-dashboard",
    element: <BuyerProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <BuyerDashboard /> },
          { path: "orders", element: <DashboardOrders /> },
          { path: "orders/:orderId", element: <DashboardOrderDetail /> },
          { path: "projects", element: <BuyerProjects /> },
          { path: "wallet", element: <BuyerWallet /> },
          { path: "profile", element: <Profile /> },
        ]
      }
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
          { path: "websites/new", element: <AddWebsite /> },
          { path: "websites/:slug", element: <PublisherWebsiteDetail /> },
          { path: "websites/:slug/edit", element: <AddWebsite /> },
          { path: "press-releases", element: <PressReleaseListing /> },
          { path: "orders", element: <DashboardOrders /> },
          { path: "orders/:orderId", element: <DashboardOrderDetail /> },
          { path: "gigs", element: <DashboardGigs /> },
          { path: "earnings", element: <DashboardEarnings /> },
          { path: "gigs/new", element: <CreateGig /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  ...adminRoutes,
  ...packageManagerRoutes,
]);
