import { Check } from "lucide-react";

const CheckIcon = () => (
  <Check className="h-5 w-5 shrink-0 text-accent-yellow" aria-hidden="true" />
);

const AuthSidePanel = ({
  headline = "Grow your reach with",
  accentText = "trusted publishers",
  description = "Order guest posts and press releases from one dashboard.",
  trustPoints = [
    "Verified high-authority publishers",
    "Rapid delivery in 1–3 days",
    "Transparent pricing & live reports",
  ],
}) => {
  return (
    <>
      {/* Mobile compact header strip (below lg) */}
      <section className="border-b border-border bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-8 text-center text-white lg:hidden">
        <h2 className="text-2xl font-bold tracking-tight">
          {headline}{" "}
          <span className="text-accent-yellow">{accentText}</span>
        </h2>
        {description && <p className="mt-2 text-sm text-gray-300">{description}</p>}
      </section>

      {/* Desktop split-screen panel (lg and above) */}
      <section className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-12 text-white lg:flex">
        
        {/* Soft yellow and blue glow blurs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-yellow/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
        />

        {/* Panel content */}
        <div className="relative z-10 max-w-md">
          <div className="mb-6 inline-flex items-center rounded-lg bg-white p-2 shadow-sm">
            <img
              src="/images/logo.png"
              alt="sumit devtech logo"
              title="sumit devtech logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            {headline}
            <span className="block text-accent-yellow">{accentText}</span>
          </h2>

          <p className="mt-4 text-base text-gray-300">{description}</p>

          <ul className="mt-8 space-y-3.5">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium text-gray-200">
                <CheckIcon />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default AuthSidePanel;
