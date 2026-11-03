const WebsiteFaq = ({ detail }) => {
  const faqs = detail.faqs || [];

  return (
    <section id="faq" className="scroll-mt-36 rounded-2xl border border-border bg-white p-6 shadow-xs">
      <div className="border-b border-border pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Questions</span>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-fg md:text-2xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl border border-border bg-white p-4 transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-fg outline-none">
              <span>{faq.q}</span>
              <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream text-primary transition-transform duration-200 group-open:rotate-45">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default WebsiteFaq;

