// CtaBanner.jsx
import { Link } from "react-router-dom";

const CtaBanner = () => (
  <section className="bg-primary py-16 text-white">
    <div className="mx-auto max-w-3xl px-4 text-center">
      <h2 className="text-white">Ready to Build a Stronger Link Profile?</h2>
      <p className="mt-4 text-white/80">
        Tell us your SEO goals, target pages, niche and budget, or explore individual
        publisher opportunities in the marketplace.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a href="#contact" className="rounded-lg bg-accent-yellow px-6 py-3 font-semibold text-fg hover:opacity-90">
          Get Started With Link Building →
        </a>
        <Link to="/marketplace" className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">
          Explore Marketplace
        </Link>
      </div>
      <p className="mt-6 text-sm text-white/70">No contracts. No setup fees. No hidden costs. Cancel any month.</p>
    </div>
  </section>
);

export default CtaBanner;