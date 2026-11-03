const Guidelines = ({ detail }) => {
  const allowed = detail.guidelines?.allowed || [];
  const notAllowed = detail.guidelines?.notAllowed || [];

  return (
    <section id="guidelines" className="scroll-mt-36 space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
        <div className="border-b border-border pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Editorial Policy</span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl">
            Content guidelines
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Allowed card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <h3 className="text-sm font-bold uppercase tracking-wider">What&apos;s allowed</h3>
            </div>

            <ul className="mt-4 space-y-3">
              {allowed.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Allowed card */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
            <div className="flex items-center gap-2 text-accent-red">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <h3 className="text-sm font-bold uppercase tracking-wider">Not allowed</h3>
            </div>

            <ul className="mt-4 space-y-3">
              {notAllowed.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-red text-white">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guidelines;

