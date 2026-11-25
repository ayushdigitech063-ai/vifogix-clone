import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { navLinks, authLinks } from "../data/navLinks";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";

const ChevronDownIcon = ({ className = "h-4 w-4" }) => (
  <ChevronDown className={className} aria-hidden="true" />
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [desktopDashboardOpen, setDesktopDashboardOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const [mobileDashboardAccordionOpen, setMobileDashboardAccordionOpen] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const dashboardDropdownRef = useRef(null);
  const dashboardTriggerRef = useRef(null);
  const menuItemsRef = useRef([]);
  const timeoutRef = useRef(null);
  const dashboardTimeoutRef = useRef(null);

  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();
  const isLoggedIn = isAuthenticated && Boolean(user);
  console.log( "user", user , "isAuthenticated", isAuthenticated, "isLoggedIn", isLoggedIn, "wishlistCount", wishlistCount);

  // Close menus on route change
  useEffect(() => {
    setDesktopDropdownOpen(false);
    setDesktopDashboardOpen(false);
    setOpen(false);
  }, [location.pathname]);

  // Handle outside click & escape key to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        dashboardDropdownRef.current &&
        !dashboardDropdownRef.current.contains(e.target) &&
        dashboardTriggerRef.current &&
        !dashboardTriggerRef.current.contains(e.target)
      ) {
        setDesktopDashboardOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDesktopDropdownOpen(false);
        setDesktopDashboardOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dashboard Hover handlers with 150ms delay
  const handleDashboardMouseEnter = () => {
    if (dashboardTimeoutRef.current) clearTimeout(dashboardTimeoutRef.current);
    setDesktopDashboardOpen(true);
  };

  const handleDashboardMouseLeave = () => {
    dashboardTimeoutRef.current = setTimeout(() => {
      setDesktopDashboardOpen(false);
    }, 150);
  };

  // Hover handlers with 150ms delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 150);
  };

  // Keyboard navigation for dropdown
  const handleTriggerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setDesktopDropdownOpen(true);
      setTimeout(() => {
        menuItemsRef.current[0]?.focus();
      }, 50);
    }
  };

  const handleMenuItemKeyDown = (index, e, total) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % total;
      menuItemsRef.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      menuItemsRef.current[prev]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDesktopDropdownOpen(false);
      triggerRef.current?.focus();
    }
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-primary" : "text-fg hover:text-primary"
    }`;

  // Helper to check if any child link is currently active
  const isParentActive = (children) =>
    children?.some((child) => location.pathname === child.href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="sumitdevtech"
            title="Go to homepage"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            if (item.children) {
              const active = isParentActive(item.children);

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={desktopDropdownOpen}
                    onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                    onKeyDown={handleTriggerKeyDown}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                      active || desktopDropdownOpen
                        ? "text-primary"
                        : "text-fg hover:text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        desktopDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {desktopDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      role="menu"
                      aria-label={item.label}
                      className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl animate-fade-in"
                    >
                      {item.children.map((child, idx) => {
                        const isChildActive = location.pathname === child.href;

                        return (
                          <Link
                            key={child.label}
                            ref={(el) => (menuItemsRef.current[idx] = el)}
                            to={child.href}
                            role="menuitem"
                            tabIndex={desktopDropdownOpen ? 0 : -1}
                            onKeyDown={(e) =>
                              handleMenuItemKeyDown(idx, e, item.children.length)
                            }
                            onClick={() => setDesktopDropdownOpen(false)}
                            className={`group block rounded-lg px-3 py-2.5 transition-colors hover:bg-cream ${
                              isChildActive ? "bg-cream/70" : ""
                            }`}
                          >
                            <span
                              className={`block text-sm font-semibold transition-colors group-hover:text-primary ${
                                isChildActive ? "text-primary" : "text-fg"
                              }`}
                            >
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs text-muted">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <NavLink to={item.href} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth / Dashboard Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Link
                to={authLinks.wishlist.href}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg transition-colors hover:border-primary hover:text-primary"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white shadow-sm">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to={authLinks.cart.href}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg transition-colors hover:border-primary hover:text-primary"
                title="Cart"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>

              {/* Dashboard Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleDashboardMouseEnter}
                onMouseLeave={handleDashboardMouseLeave}
              >
                <button
                  ref={dashboardTriggerRef}
                  type="button"
                  onClick={() => setDesktopDashboardOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-light"
                  aria-expanded={desktopDashboardOpen}
                  aria-haspopup="true"
                >
                  Dashboard
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      desktopDashboardOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {desktopDashboardOpen && (
                  <div
                    ref={dashboardDropdownRef}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-surface p-2 shadow-xl ring-1 ring-black/5"
                  >
                    <Link
                      to="/buyer-dashboard"
                      onClick={() => setDesktopDashboardOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-cream hover:text-primary"
                    >
                      Buyer Dashboard
                    </Link>
                    <Link
                      to="/publisher-dashboard"
                      onClick={() => setDesktopDashboardOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-cream hover:text-primary"
                    >
                      Publisher Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to={authLinks.signIn.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  location.pathname === authLinks.signIn.href
                    ? "bg-primary text-white hover:bg-primary-light"
                    : "border border-border text-fg hover:border-primary hover:text-primary"
                }`}
              >
                {authLinks.signIn.label}
              </Link>
              <Link
                to={authLinks.signUp.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  location.pathname === authLinks.signUp.href
                    ? "bg-primary text-white hover:bg-primary-light"
                    : location.pathname === authLinks.signIn.href
                    ? "border border-border text-fg hover:border-primary hover:text-primary"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                {authLinks.signUp.label}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="rounded-lg p-1 text-fg hover:text-primary lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden animate-fade-in">
          <ul className="space-y-2">
            {navLinks.map((item) => {
              if (item.children) {
                const active = isParentActive(item.children);

                return (
                  <li key={item.label} className="border-b border-border/50 pb-2">
                    <button
                      type="button"
                      onClick={() => setMobileAccordionOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between py-2 text-sm font-semibold ${
                        active ? "text-primary" : "text-fg"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileAccordionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {mobileAccordionOpen && (
                      <ul className="ml-2 mt-1 space-y-1.5 border-l-2 border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.href}
                              onClick={() => setOpen(false)}
                              className={`block py-1.5 text-sm transition-colors hover:text-primary ${
                                location.pathname === child.href
                                  ? "font-semibold text-primary"
                                  : "text-muted"
                              }`}
                            >
                              <span className="block font-medium text-fg">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="block text-xs text-muted">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Mobile Auth Buttons / Dashboard */}
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <Link
                    to={authLinks.wishlist.href}
                    onClick={() => setOpen(false)}
                    className="relative flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
                  >
                    <span className="relative flex items-center">
                      <Heart className="h-4 w-4" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                          {wishlistCount > 99 ? "99+" : wishlistCount}
                        </span>
                      )}
                    </span>
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to={authLinks.cart.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </Link>
                </div>

                {/* Mobile Dashboard Accordion */}
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setMobileDashboardAccordionOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
                    aria-expanded={mobileDashboardAccordionOpen}
                  >
                    <span>Dashboard</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileDashboardAccordionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileDashboardAccordionOpen && (
                    <div className="mt-2 flex flex-col space-y-1 rounded-xl border border-border bg-surface p-2">
                      <Link
                        to="/buyer-dashboard"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-fg hover:bg-cream hover:text-primary"
                      >
                        Buyer Dashboard
                      </Link>
                      <Link
                        to="/publisher-dashboard"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-fg hover:bg-cream hover:text-primary"
                      >
                        Publisher Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={authLinks.signIn.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${
                    location.pathname === authLinks.signIn.href
                      ? "bg-primary text-white hover:bg-primary-light"
                      : "border border-border text-fg hover:border-primary hover:text-primary"
                  }`}
                >
                  {authLinks.signIn.label}
                </Link>
                <Link
                  to={authLinks.signUp.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${
                    location.pathname === authLinks.signUp.href
                      ? "bg-primary text-white hover:bg-primary-light"
                      : location.pathname === authLinks.signIn.href
                      ? "border border-border text-fg hover:border-primary hover:text-primary"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {authLinks.signUp.label}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
