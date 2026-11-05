import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Link } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2, AtSign } from "lucide-react";
import { signInSchema, signUpSchema } from "../../schemas";

// Icons using lucide-react
const UserIcon = () => <User className="h-5 w-5 text-muted" aria-hidden="true" />;
const MailIcon = () => <Mail className="h-5 w-5 text-muted" aria-hidden="true" />;
const LockIcon = () => <Lock className="h-5 w-5 text-muted" aria-hidden="true" />;
const AtSignIcon = () => <AtSign className="h-5 w-5 text-muted" aria-hidden="true" />;
const ErrorAlertIcon = () => <AlertCircle className="h-4 w-4 shrink-0 text-accent-red" aria-hidden="true" />;
const EyeIcon = () => <Eye className="h-4 w-4 text-muted hover:text-fg" aria-hidden="true" />;
const EyeSlashIcon = () => <EyeOff className="h-4 w-4 text-muted hover:text-fg" aria-hidden="true" />;
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />;

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-fg">
    {children}
  </label>
);

// Password strength calculation helper (visual only)
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score === 1) return { score: 1, label: "Weak", color: "bg-accent-red" };
  if (score === 2) return { score: 2, label: "Medium", color: "bg-accent-yellow" };
  return { score: 3, label: "Strong", color: "bg-primary" };
};

const SignUpForm = ({ mode = "signin", onSubmit }) => {
  const isSignup = mode === "signup";
  const toast = useToast();

  const [form, setForm] = useState({
    role: "buyer",
    name: "",
    email: "",
    platform: "LinkedIn",
    username: "",
    password: "",
    remember: false,
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const validate = () => {
    const schema = isSignup ? signUpSchema : signInSchema;
    const result = schema.safeParse(form);
    if (result.success) return {};

    const next = {};
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const [key, msgs] of Object.entries(fieldErrors)) {
      if (msgs && msgs[0]) next[key] = msgs[0];
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fill in the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.(form);
      toast.success(isSignup ? "Account created successfully!" : "Signed in successfully!");
    } catch (err) {
      toast.error("User authentication failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = isSignup ? getPasswordStrength(form.password) : null;

  return (
    <div className="w-full max-w-[440px] animate-fade-in rounded-2xl border border-border bg-surface p-7 shadow-xl transition-all md:p-9">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isSignup ? "Sign up to start ordering verified placements." : "Sign in to manage your orders & dashboard."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
        {/* Role Selector (Sign In & Sign Up) */}
        <div>
          <Label>Select your role</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, role: "buyer" }))}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition ${
                form.role === "buyer"
                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                  : "border-border bg-surface text-muted hover:border-primary/40 hover:text-fg"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  form.role === "buyer" ? "bg-primary" : "border border-muted"
                }`}
              />
              <span>I am buyer</span>
            </button>

            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, role: "seller" }))}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition ${
                form.role === "seller"
                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                  : "border-border bg-surface text-muted hover:border-primary/40 hover:text-fg"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  form.role === "seller" ? "bg-primary" : "border border-muted"
                }`}
              />
              <span>I am seller</span>
            </button>
          </div>
          {errors.role && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
              <ErrorAlertIcon />
              <span>{errors.role}</span>
            </p>
          )}
        </div>

        {/* Full Name (Sign Up only) */}
        {isSignup && (
          <div>
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <UserIcon />
              </span>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
                className={`h-11 w-full rounded-lg border bg-surface pl-11 pr-4 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? "border-accent-red" : "border-border"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
                <ErrorAlertIcon />
                <span>{errors.name}</span>
              </p>
            )}
          </div>
        )}

        {/* Email */}
        <div>
          <Label htmlFor="email">Work Email</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MailIcon />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set("email")}
              className={`h-11 w-full rounded-lg border bg-surface pl-11 pr-4 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.email ? "border-accent-red" : "border-border"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
              <ErrorAlertIcon />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Social Media Dropdown & ID (Sign Up only) */}
        {isSignup && (
          <div>
            <Label htmlFor="username">Social Media Profile</Label>
            <div className="flex gap-2">
              {/* Dropdown for Platform */}
              <div className="w-1/3 min-w-[125px]">
                <select
                  id="platform"
                  value={form.platform}
                  onChange={set("platform")}
                  className={`h-11 w-full rounded-lg border bg-surface px-3 text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.platform ? "border-accent-red" : "border-border"
                  }`}
                  aria-label="Social media platform"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>

              {/* Input for Social Media Username / Profile link */}
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <AtSignIcon />
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder={
                    form.platform === "LinkedIn"
                      ? "username or linkedin.com/in/..."
                      : form.platform === "Facebook"
                      ? "username or facebook.com/..."
                      : "username or @handle"
                  }
                  value={form.username}
                  onChange={set("username")}
                  className={`h-11 w-full rounded-lg border bg-surface pl-11 pr-4 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.username ? "border-accent-red" : "border-border"
                  }`}
                />
              </div>
            </div>

            {/* Error Messages */}
            {(errors.platform || errors.username) && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
                <ErrorAlertIcon />
                <span>{errors.platform || errors.username}</span>
              </p>
            )}
          </div>
        )}

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {!isSignup && (
              <Link to="/forgot-password" className="text-xs font-semibold text-primary transition hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <LockIcon />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              className={`h-11 w-full rounded-lg border bg-surface pl-11 pr-11 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                errors.password ? "border-accent-red" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted hover:text-fg focus:outline-none"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Password strength indicator for signup */}
          {isSignup && form.password && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      segment <= strength.score ? strength.color : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-right text-[11px] font-medium text-muted">
                Password strength: <span className="font-semibold text-fg">{strength.label}</span>
              </p>
            </div>
          )}

          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
              <ErrorAlertIcon />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Checkbox (Terms or Remember Me) */}
        {isSignup ? (
          <div>
            <label className="flex items-start gap-2.5 text-xs text-muted">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={set("terms")}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
              />
              <span>
                I agree to the{" "}
                <Link to="/terms-and-conditions" className="font-medium text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
                <ErrorAlertIcon />
                <span>{errors.terms}</span>
              </p>
            )}
          </div>
        ) : (
          <label className="flex items-center gap-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={set("remember")}
              className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
            />
            Remember me
          </label>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary-light active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Spinner />}
          <span>{loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface text-sm font-semibold text-fg shadow-sm transition hover:bg-cream/60 active:bg-cream"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        Continue with Google
      </button>

      {/* Footer Switch */}
      <p className="mt-6 text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <Link to={isSignup ? "/signin" : "/signup"} className="font-semibold text-primary transition hover:underline">
          {isSignup ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
