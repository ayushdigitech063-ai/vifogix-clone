const StorySection = ({ story }) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          {/* Left: Decorative rounded-2xl dark card */}
          <div className="md:col-span-5">
            <div
              aria-hidden="true"
              className="relative overflow-hidden rounded-2xl border border-border bg-navy-900 p-8 text-white shadow-xl"
            >
              {/* Subtle ambient blur */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent-yellow/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-primary/25 blur-2xl" />

              <div className="relative z-10">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {story.badge.label}
                </span>
                <span className="mt-1 block text-4xl font-extrabold text-accent-yellow sm:text-5xl">
                  {story.badge.value}
                </span>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-primary-light">
                    Core Pillars
                  </span>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {story.chips.map((chip) => (
                      <div
                        key={chip}
                        className="rounded-xl border border-white/15 bg-white/5 p-3 text-center text-xs font-semibold text-white/90 backdrop-blur-sm"
                      >
                        {chip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy & Quote */}
          <div className="md:col-span-7">
            {story.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {story.eyebrow}
              </p>
            )}

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg md:text-4xl">
              {story.title}
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-500 md:text-base">
              {story.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Blockquote with 4px yellow left border */}
            {story.quote && (
              <blockquote className="mt-6 border-l-4 border-accent-yellow pl-4 italic text-fg">
                <p className="text-sm font-medium leading-relaxed md:text-base">
                  "{story.quote}"
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

