const PublishingDetails = ({ site, detail }) => {
  const days = site.days || site.turnaround || "2–5";
  const linkText = `${site.maxLinks || "1–2"} ${site.linkType || "editorial"} links`;

  const detailsList = [
    { label: "Delivery time", value: `${days} days` },
    { label: "Link format", value: linkText },
    { label: "Publishing language", value: detail.language },
    { label: "Minimum word count", value: `${detail.minWords} words` },
    { label: "Sponsored label", value: detail.sponsoredLabel },
    { label: "Search indexing", value: detail.indexing },
  ];

  return (
    <section id="publishing" className="scroll-mt-36 rounded-2xl border border-border bg-white p-6 shadow-xs">
      <div className="border-b border-border pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Specs</span>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl">
          Publishing details
        </h2>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 divide-y divide-border/60 md:grid-cols-2 md:divide-y-0">
        {detailsList.map((item, idx) => (
          <div
            key={item.label}
            className={`flex flex-col justify-between py-2.5 ${idx % 2 === 0 ? "md:border-b md:border-border/60" : "md:border-b md:border-border/60"}`}
          >
            <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-bold text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default PublishingDetails;

