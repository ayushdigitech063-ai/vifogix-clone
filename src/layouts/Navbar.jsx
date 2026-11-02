import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { navLinks, authLinks } from "../data/navLinks";

const ChevronDownIcon = ({ className = "h-4 w-4" }) => (
  <ChevronDown className={className} aria-hidden="true" />
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuItemsRef = useRef([]);
  const timeoutRef = useRef(null);

  // Check login state
  useEffect(() => {
    const checkAuth = () => {
      const user =
        localStorage.getItem("user") ||
        localStorage.getItem("token") ||
        localStorage.getItem("isLoggedIn");
      setIsLoggedIn(!!user);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDesktopDropdownOpen(false);
    setOpen(false);
  }, [location.pathname]);

  // Handle outside click & escape key to close desktop dropdown
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
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDesktopDropdownOpen(false);
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
            <Link
              to={authLinks.dashboard.href}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
            >
              {authLinks.dashboard.label}
            </Link>
          ) : (
            <>
              <Link
                to={authLinks.signIn.href}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-fg hover:border-primary hover:text-primary"
              >
                {authLinks.signIn.label}
              </Link>
              <Link
                to={authLinks.signUp.href}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
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
              <Link
                to={authLinks.dashboard.href}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-light"
              >
                {authLinks.dashboard.label}
              </Link>
            ) : (
              <>
                <Link
                  to={authLinks.signIn.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-center text-sm font-semibold text-fg hover:border-primary hover:text-primary"
                >
                  {authLinks.signIn.label}
                </Link>
                <Link
                  to={authLinks.signUp.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-light"
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
