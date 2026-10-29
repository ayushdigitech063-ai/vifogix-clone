

function MetricBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs">
      <span className="font-semibold text-muted">{label}</span>
      <span className="font-bold text-fg">{value}</span>
    </span>
  );
}
const WebsiteRow = ({site}) =>{
     const {
    domain, price, category, maxLinks, turnaround, country,
    traffic, dr, da, as, backlinks, added, age, deals,
  } = site;

  return (
    <tr className="align-top hover:bg-background/60">
      {/* Price */}
      <td className="px-4 py-4">
        <p className="font-medium text-fg">{domain}</p>
        <button className="mt-2 rounded-md bg-accent-red px-3 py-1 text-xs font-semibold text-white hover:opacity-90">
          Buy {price} USD
        </button>
      </td>

      {/* Website */}
      <td className="px-4 py-4">
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 font-medium text-primary hover:underline"
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt=""
            className="h-5 w-5"
          />
          {domain}
        </a>
        <ul className="mt-2 space-y-0.5 text-xs text-muted">
          <li>Max: {maxLinks}</li>
          <li>Turnaround: {turnaround}</li>
          <li>Country: {country}</li>
        </ul>
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {category}
        </span>
      </td>

      {/* Traffic */}
      <td className="px-4 py-4">
        <ul className="space-y-1 text-xs">
          <li><span className="text-muted">Semrush</span> <b>{traffic.semrush}</b></li>
          <li><span className="text-muted">Ahrefs</span> <b>{traffic.ahrefs}</b></li>
        </ul>
      </td>

      {/* DR | DA | AS */}
      <td className="px-4 py-4">
        <div className="flex flex-col items-start gap-1">
          <MetricBadge label="DR" value={dr} />
          <MetricBadge label="DA" value={da} />
          <MetricBadge label="AS" value={as} />
        </div>
      </td>

      {/* Backlinks */}
      <td className="px-4 py-4">
        <p className="font-medium text-fg">
          {backlinks.followed}/{backlinks.noFollowed}
        </p>
        <p className="text-xs text-muted">Followed/No Followed</p>
      </td>

      {/* Domain Info */}
      <td className="px-4 py-4 text-xs text-muted">
        <p>Added: {added}</p>
        <p>Age: {age}</p>
      </td>

      {/* No. of Deal */}
      <td className="px-4 py-4 font-semibold text-fg">{deals}</td>
    </tr>
  );
}
export default WebsiteRow;