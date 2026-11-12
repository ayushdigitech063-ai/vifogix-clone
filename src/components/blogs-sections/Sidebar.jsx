import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Mail } from "lucide-react";

const MailIcon = () => (
  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
);

const Sidebar = ({ tags = [], onTagClick, newsletter }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    toast.success("Subscribed successfully!");
    // TODO: Connect email newsletter subscription endpoint
  };

  return (
    <aside className="space-y-6 lg:w-80 lg:shrink-0" aria-label="Sidebar information">
      {/* Popular Tags Box */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-fg">
          Popular Topics
        </h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="rounded-full border border-border bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-primary hover:bg-cream hover:text-primary active:scale-95"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Newsletter Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <MailIcon />
        </div>

        <h4 className="mt-3 text-base font-bold text-fg">
          {newsletter?.title || "Weekly Outreach Digest"}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          {newsletter?.description || "Curated insights, proven backlink case studies, and SEO tips delivered every Tuesday."}
        </p>

        {submitted ? (
          <div className="mt-4 rounded-lg bg-primary/10 p-3 text-xs font-semibold text-primary">
            ✓ You're subscribed! Thanks for joining.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-4 space-y-2.5">
            <div>
              <label htmlFor="sidebar-email" className="sr-only">
                Email address
              </label>
              <input
                id="sidebar-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`h-10 w-full rounded-lg border bg-surface px-3 text-xs text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  error ? "border-accent-red" : "border-border"
                }`}
              />
              {error && <p className="mt-1 text-[11px] text-accent-red">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              {newsletter?.buttonLabel || "Join Newsletter"}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

