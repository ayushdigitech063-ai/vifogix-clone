import { useState } from "react";
import { useToast } from "../../hooks/useToast";

const NewsletterSection = ({ newsletter }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setStatus("success");
    setErrorMessage("");
    toast.success("Thank you for subscribing to our weekly newsletter!");
    // TODO: Connect newsletter subscription API endpoint here
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          {/* Background glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-yellow/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-accent-yellow backdrop-blur-sm">
              Weekly Industry Intelligence
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-4xl">
              {newsletter?.title || "Stay Ahead in Modern Search & PR"}
            </h2>

            <p className="mt-3 text-sm text-gray-300 md:text-base">
              {newsletter?.description ||
                "Get vetted outreach playbooks, publisher algorithm insights, and high-impact SEO workflows delivered to your inbox."}
            </p>

            {status === "success" ? (
              <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-4 text-sm font-semibold text-accent-yellow backdrop-blur-sm">
                ✓ Thank you for subscribing! Check your inbox soon for our latest strategy breakdown.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email-input" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email-input"
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className={`h-11 flex-1 rounded-lg border bg-surface/10 px-4 text-sm text-white placeholder:text-gray-400 outline-none backdrop-blur-sm transition focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 ${
                      status === "error" ? "border-accent-red" : "border-white/20"
                    }`}
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-lg bg-accent-yellow px-6 text-sm font-semibold text-fg transition hover:opacity-90 active:scale-95"
                  >
                    {newsletter?.buttonLabel || "Subscribe Now"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="mt-2 text-xs font-medium text-accent-red">
                    {errorMessage}
                  </p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Zero spam. Unsubscribe with one click at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

