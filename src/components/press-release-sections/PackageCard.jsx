import { Link } from "react-router-dom";

const Stat = ({ value, label }) => (
  <div className="flex-1 rounded-lg bg-cream py-2 text-center">
    <div className="text-sm font-bold text-fg">{value}</div>
    <div className="text-[11px] text-gray-500">{label}</div>
  </div>
);

const PackageCard = ({ pkg }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
    <div className="flex items-center gap-3 bg-primary/5 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
        {pkg.logoDomain ? (
          <img
            src={`https://www.google.com/s2/favicons?domain=${pkg.logoDomain}&sz=64`}
            alt="package logo"
            title="package logo"
            width="32"
            height="32"
          />
        ) : (
          <span className="text-lg font-bold text-primary">{pkg.title[0]}</span>
        )}
      </div>
      <h3 className="text-base font-bold leading-snug text-fg">{pkg.title}</h3>
    </div>

    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Stat value="PR" label="Type" />
        <Stat value={`${pkg.days} Days`} label="TAT" />
        <Stat value={pkg.backlinks} label="Backlinks" />
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {pkg.highlights.map((h) => (
          <li key={h} className="rounded-full bg-cream px-3 py-1 text-[11px] font-medium text-fg">
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="flex items-center gap-1 text-[11px] text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
            Price
          </p>
          <p className="text-2xl font-extrabold text-fg">
            ${pkg.price}
            <span className="text-xs font-medium text-gray-500"> / release</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          to={`/press-release/package/${pkg.slug}`}
          className="rounded-lg border border-border py-2 text-center text-sm font-semibold text-fg transition hover:bg-gray-50"
        >
          View details
        </Link>
        <Link
          to="/signup"
          className="rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          Buy now · ${pkg.price}
        </Link>
      </div>
    </div>
  </article>
);

export default PackageCard;