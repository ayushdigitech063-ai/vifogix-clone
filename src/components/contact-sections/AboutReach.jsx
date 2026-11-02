const AboutReach = ({ about, reach }) => {
  // Filter out items with empty values
  const validItems = reach.items.filter((item) => item.value && item.value.trim());

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: About Copy */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Vision
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg md:text-4xl">
              {about.title}
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-500 md:text-base">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Ways to reach us Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-white p-7 shadow-sm transition hover:shadow-md md:p-9">
              <h3 className="text-xl font-bold text-fg md:text-2xl">
                {reach.title}
              </h3>
              {reach.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {reach.description}
                </p>
              )}

              {/* Items List */}
              <ul className="mt-6 divide-y divide-border/60">
                {validItems.map((item) => (
                  <li key={item.label} className="py-3.5 first:pt-0 last:pb-0">
                    <span className="block text-xs font-medium text-gray-500">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-0.5 inline-block font-semibold text-fg transition hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="mt-0.5 block font-semibold text-fg">
                        {item.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              {reach.socials && reach.socials.length > 0 && (
                <div className="mt-7 border-t border-border pt-6">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Connect on social media
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reach.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Closing line */}
              {reach.closing && (
                <p className="mt-6 text-xs italic text-muted">
                  "{reach.closing}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutReach;

