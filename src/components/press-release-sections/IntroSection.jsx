import { Link } from "react-router-dom";

const IntroSection = ({ data }) => (
  <section className="bg-background py-12 md:py-16">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
      {/* Decorative illustration – swap for your own image if you have one */}
      <div aria-hidden="true" className="rounded-2xl bg-gradient-to-br from-[#171f38] to-[#0a0e1a] p-8">
        <div className="space-y-3 rounded-xl bg-white p-5">
          <div className="h-3 w-1/3 rounded bg-accent-yellow" />
          <div className="h-5 w-4/5 rounded bg-fg/80" />
          <div className="h-2 w-full rounded bg-gray-200" />
          <div className="h-2 w-full rounded bg-gray-200" />
          <div className="h-2 w-2/3 rounded bg-gray-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-20 rounded-full bg-primary" />
            <div className="h-8 w-20 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-fg md:text-4xl">{data.title}</h2>
        {data.paragraphs.map((p) => (
          <p key={p} className="mt-4 text-base leading-relaxed text-gray-500">{p}</p>
        ))}
        <Link
          to={data.button.href}
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {data.button.label}
        </Link>
      </div>
    </div>
  </section>
);

export default IntroSection;