// src/pages/admin/PackageManagerLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Loader2, Package, ShieldCheck } from "lucide-react";
import { loginSchema } from "../../schemas/auth.schema";
import { packageManagerLogin } from "../../services/packageManagerService";
import { setAccessToken, setUserRole } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const PackageManagerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const auth = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const from = location.state?.from?.pathname || "/package-manager/packages";

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validation = loginSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0] || "general";
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await packageManagerLogin({
        email: validation.data.email,
        password: validation.data.password,
      });

      const payload = response?.data || response;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.packageManager || payload?.user || {
        email: validation.data.email,
        role: "PACKAGE_MANAGER",
      };

      if (token) {
        setAccessToken(token);
      }
      setUserRole(user.role || "PACKAGE_MANAGER");

      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // ignore
      }

      if (auth?.user !== undefined) {
        window.dispatchEvent(new Event("storage"));
      }

      toast.success("Welcome back! Signed in to Package Manager Admin.");
      navigate(from, { replace: true });
      window.location.reload();
    } catch (err) {
      const msg = err.message || "Failed to sign in. Please verify your credentials.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Left panel - Decorative banner */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-12 border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">Vefogix</span>
              <span className="ml-2 rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                Package Manager
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <ShieldCheck className="h-4 w-4" />
            Dedicated Package Management Portal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Manage packages, pricing, features, and plans in one secure place.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Authorized portal for Package Managers. Maintain public offerings, configure custom tiers, toggle visibility, and update pricing models across the marketplace.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Vefogix Clone. Authorized Personnel Only.
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 md:px-16 lg:px-20 bg-slate-950">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Vefogix</span>
              <span className="ml-2 rounded bg-indigo-500/20 px-1.5 py-0.5 text-xs font-semibold text-indigo-300">
                Package Manager
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Package Manager Login
            </h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to access the package administration dashboard.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-sm text-red-200"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="pm-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="pm-email"
                  type="email"
                  autoComplete="email"
                  placeholder="package.manager@vefogix.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={`w-full rounded-xl border bg-slate-900/80 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="pm-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="pm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className={`w-full rounded-xl border bg-slate-900/80 px-3.5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange("remember")}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in as Package Manager</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageManagerLogin;

