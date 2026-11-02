import { useState } from "react";
import { Heart } from "lucide-react";

const Metric = ({ value, label }) => (
  <div className="flex-1 rounded-lg bg-gray-50 py-2 text-center">
    <div className="text-lg font-bold text-fg">{value}</div>
    <div className="text-[11px] text-gray-500">{label}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-fg">{value}</span>
  </div>
);

const WebsiteCard = ({ site }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="bg-gray-50 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {site.categories.map((c) => (
              <span key={c} className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-primary">
                {c}
              </span>
            ))}
          </div>
          <button
            onClick={() => setLiked(!liked)}
            aria-label="Save website"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 hover:text-accent-red"
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-accent-red text-accent-red" : "text-gray-500"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
            alt=""
            width="40"
            height="40"
            className="rounded-lg bg-white p-1"
          />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-fg">{site.domain}</h3>
            <p className="text-xs text-gray-500">{site.country}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          <Metric value={site.dr} label="DR" />
          <Metric value={site.da} label="DA" />
          <Metric value={site.as} label="AS" />
        </div>

        <div className="space-y-2">
          <Row label="Traffic (Ahrefs)" value={site.traffic} />
          <Row label="Backlinks" value={site.backlinks} />
          <Row label="Links" value={`${site.maxLinks} ${site.linkType} Links`} />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <span className="text-sm font-semibold text-fg">{site.days} Days</span>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-[11px] text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
              Starting at
            </p>
            <p className="text-xl font-extrabold text-fg">${site.price}</p>
          </div>
        </div>

        <a
          href="/signup"
          className="block rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          Buy now
        </a>
      </div>
    </article>
  );
};

export default WebsiteCard;
