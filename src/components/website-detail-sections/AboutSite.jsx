const AboutSite = ({ site, detail }) => {
  const domain = site.domain || "Website";
  const linkType = site.linkType || "DoFollow / NoFollow";

  return (
    <section id="overview" className="scroll-mt-36 rounded-2xl border border-border bg-white p-6 shadow-xs">
      <div className="border-b border-border pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</span>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl">
          About {domain}
        </h2>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        {detail.about}
      </p>

      {/* 3 Quick Facts Chips */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-cream/50 px-3.5 py-2 text-xs font-medium text-fg">
          <span className="text-gray-400">Language:</span>
          <span className="font-semibold text-fg">{detail.language}</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-cream/50 px-3.5 py-2 text-xs font-medium text-fg">
          <span className="text-gray-400">Country:</span>
          <span className="font-semibold text-fg">{site.country || "Global"}</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-cream/50 px-3.5 py-2 text-xs font-medium text-fg">
          <span className="text-gray-400">Link type:</span>
          <span className="font-semibold text-primary">{linkType}</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSite;

