
import { useState } from "react";
import { Heart, Clock, TrendingUp, Link2, Layers } from "lucide-react";

const Metric = ({ label, value }) => (
  <div className="rounded-lg bg-background px-3 py-2 text-center">
    <p className="text-lg font-bold text-fg">{value}</p>
    <p className="text-xs text-muted">{label}</p>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <li className="flex items-center justify-between gap-3">
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </span>
    <span className="font-semibold text-fg">{value}</span>
  </li>
);

const WebsiteCard = ({ site }) => {
  const [saved, setSaved] = useState(false);
  const { domain, price, category, maxLinks, turnaround, country, traffic, dr, da, as, backlinks, deals } = site;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="relative bg-primary/5 p-5 pt-14">
        <span className="absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">
          {category}
        </span>
        <button
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save website"}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted hover:text-accent-red"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-accent-red text-accent-red" : ""}`} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            className="h-10 w-10 rounded-lg bg-surface p-1"
          />
          <div className="min-w-0">
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noreferrer"
              className="block truncate font-semibold text-fg hover:text-primary"
            >
              {domain}
            </a>
            <p className="truncate text-xs text-muted">{country}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          <Metric label="DR" value={dr} />
          <Metric label="DA" value={da} />
          <Metric label="AS" value={as} />
        </div>

        <ul className="space-y-2 text-sm text-muted">
          <Stat icon={TrendingUp} label="Traffic (Ahrefs)" value={traffic.ahrefs} />
          <Stat icon={Link2} label="Backlinks" value={`${backlinks.followed}/${backlinks.noFollowed}`} />
          <Stat icon={Layers} label="Links" value={maxLinks} />
        </ul>

        <div className="mt-auto flex items-center justify-between rounded-xl bg-background px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-fg">
            <Clock className="h-4 w-4 text-muted" />
            {turnaround}
          </span>
          <span className="text-right">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-accent-yellow" />
              Starting at
            </span>
            <span className="text-xl font-bold text-fg">${price}</span>
          </span>
        </div>

        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-light">
          Buy now · {deals} deals
        </button>
      </div>
    </article>
  );
};

export default WebsiteCard;