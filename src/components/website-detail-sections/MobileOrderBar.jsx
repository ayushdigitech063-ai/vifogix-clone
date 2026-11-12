import { Link } from "react-router-dom";
import { getWebsiteSlug } from "../../utils/websiteHelpers";

const MobileOrderBar = ({ site }) => {
  const price = site.price || 0;
  const slug = getWebsiteSlug(site);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-4 py-3 shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Starting at
          </span>
          <div className="text-xl font-extrabold text-fg">${price}</div>
        </div>

        <Link
          to={`/signup?website=${slug}`}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Buy now
        </Link>
      </div>
    </div>
  );
};

export default MobileOrderBar;

