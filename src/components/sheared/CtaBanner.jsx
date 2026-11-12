// CtaBanner.jsx
import { Link } from "react-router-dom";

const CtaBanner = ({
  data,
  title,
  description,
  primary,
  tone = "default",
}) => {
  const heading = data?.title || title || "Ready to Build a Stronger Link Profile?";
  const desc =
    data?.description ||
    description ||
    "Tell us your SEO goals, target pages, niche and budget, or explore individual publisher opportunities in the marketplace.";
  const btnLabel = data?.button?.label || primary?.label || "Get Started With Link Building →";
  const btnHref = data?.button?.href || primary?.to || "#contact";

  const isInternal = btnHref.startsWith("/");
  const isNavy = tone === "navy";

  return (
    <section className="bg-navy-900 py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-white">{heading}</h2>
        <p className="mt-4 text-white/80">{desc}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isInternal ? (
            <Link
              to={btnHref}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                isNavy
                  ? "bg-accent-yellow text-navy-900 hover:opacity-90"
                  : "bg-accent-yellow text-fg hover:opacity-90"
              }`}
            >
              {btnLabel}
            </Link>
          ) : (
            <a
              href={btnHref}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                isNavy
                  ? "bg-accent-yellow text-navy-900 hover:opacity-90"
                  : "bg-accent-yellow text-fg hover:opacity-90"
              }`}
            >
              {btnLabel}
            </a>
          )}
          <Link
            to="/marketplace"
            className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explore Marketplace
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/70">
          No contracts. No setup fees. No hidden costs. Cancel any month.
        </p>
      </div>
    </section>
  );
};

export default CtaBanner;
