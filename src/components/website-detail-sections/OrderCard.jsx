import { Link } from "react-router-dom";
import { getWebsiteSlug } from "../../utils/websiteHelpers";

const OrderCard = ({ site }) => {
  const price = site.price || 0;
  const days = site.days || site.turnaround || "2–5";
  const linkText = `${site.maxLinks || "1–2"} ${site.linkType || "editorial"} links`;
  const slug = getWebsiteSlug(site);

  const trustBullets = [
    "Manual review before publishing",
    "You approve the content",
    "Support if something goes wrong",
  ];

  return (
    <aside aria-label="Order placement" className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        {/* Pricing header */}
        <div className="border-b border-border pb-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <span className="h-2 w-2 rounded-full bg-accent-yellow" />
            Starting at
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-fg">${price}</span>
            <span className="text-xs text-gray-400">/ placement</span>
          </div>
        </div>

        {/* Feature summary rows */}
        <div className="my-5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-gray-600">
            <span>Turnaround:</span>
            <span className="font-semibold text-fg">{days} days delivery</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span>Link Format:</span>
            <span className="font-semibold text-fg">{linkText}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            to={`/signup?website=${slug}`}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Buy now
          </Link>

          <Link
            to="/contact-us"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-border bg-white text-sm font-semibold text-fg transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ask a question
          </Link>
        </div>

        {/* Trust bullets */}
        <div className="mt-6 border-t border-border pt-5">
          <ul className="space-y-2.5">
            {trustBullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    className="h-2.5 w-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default OrderCard;

