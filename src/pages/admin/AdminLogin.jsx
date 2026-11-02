import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const AdminLogin = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const setField = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
    if (errors[key]) setErrors({ ...errors, [key]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      await login(form.email, form.password);
      const destination = location.state?.from?.pathname || "/admin";
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        {/* Brand strip */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#101626] px-4 py-2 shadow-md">
            <span className="font-bold tracking-tight text-white">Sumit DevTech</span>
            <span className="rounded bg-accent-yellow/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-yellow">
              Admin
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-white p-7 shadow-xl md:p-9">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
              Admin sign in
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access the administration panel.
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-accent-red"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-accent-red" aria-hidden="true" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-fg"
              >
                Admin Email
              </label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="admin@sumitdevtech.com"
                  className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-fg outline-none transition-colors placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary ${
                    errors.email ? "border-accent-red" : "border-border hover:border-gray-400 focus:border-primary"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-accent-red">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-fg"
              >
                Password
              </label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={setField("password")}
                  placeholder="••••••••"
                  className={`h-11 w-full rounded-xl border bg-white pl-10 pr-10 text-sm text-fg outline-none transition-colors placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary ${
                    errors.password ? "border-accent-red" : "border-border hover:border-gray-400 focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-fg"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-accent-red">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={setField("remember")}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
              )}
              {loading ? "Signing in..." : "Sign in to Admin"}
            </button>
          </form>

          {/* Muted Demo Note */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Demo access: use the credentials defined in adminConstants.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
