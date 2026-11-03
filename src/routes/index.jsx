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
import FaqSection from "../components/sheared/FaqSection";
import { adminRoutes } from "./AdminRoutes";

const Marketplace = lazy(() => import("../pages/Marketplace"));
const LinkBuilding = lazy(() => import("../pages/Linkbuilding"));
const WebsiteDetail = lazy(() => import("../pages/WebsiteDetail"));

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
      { path: "about-us", element: <About /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "faqs", element: <FaqSection /> },
    ],
  },
  ...adminRoutes,
]);
