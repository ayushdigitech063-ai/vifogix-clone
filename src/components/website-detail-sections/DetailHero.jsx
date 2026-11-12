import { useState } from "react";
import { Link } from "react-router-dom";

const DetailHero = ({ site }) => {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const categories = site.categories || (site.category ? [site.category] : ["General"]);
  const domain = site.domain || "";
  const firstLetter = domain.charAt(0).toUpperCase() || "W";

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${domain} - Guest Post Details`,
          url,
        });
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950 pt-10 pb-20 text-white md:pt-14 md:pb-24">
      {/* Subtle dot grid */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      /> */}

      {/* Two soft blurred glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-yellow/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted/70 md:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link to="/marketplace" className="transition-colors hover:text-white">
            Marketplace
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-white">{domain}</span>
        </nav>

        {/* Hero main row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left info */}
          <div className="flex items-start gap-4 md:items-center md:gap-5">
            {/* Favicon tile (64px) with first-letter fallback */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white p-2 shadow-lg">
              {!imgFailed ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                  alt={`${domain} icon`}
                  className="h-10 w-10 object-contain"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <span className="text-2xl font-black text-primary">{firstLetter}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                  {domain}
                </h1>
                {site.country && (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                    {site.country}
                  </span>
                )}
              </div>

              {/* Category chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right ghost buttons (Save & Share) */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => setSaved((prev) => !prev)}
              aria-label={saved ? "Remove from saved" : "Save website"}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold backdrop-blur-sm transition ${
                saved
                  ? "border-accent-red/50 bg-accent-red/20 text-accent-red"
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              <span>{saved ? "Saved" : "Save"}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share website"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
              </button>

              {copied && (
                <div
                  role="status"
                  className="absolute right-0 top-full mt-2 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-fg shadow-lg animate-fade-in"
                >
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailHero;

