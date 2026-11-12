import { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Tag,
  ArrowRight,
} from "lucide-react";
import { posts, categories, popularTags } from "../data/blogs";
import { formatDate } from "../utils/formatters";
import NewsletterSection from "../components/blogs-sections/NewsletterSection";
import { newsletter } from "../data/blogs";

const BlogDetail = () => {
  const { slug } = useParams();

  const post = useMemo(() => {
    return posts.find((p) => p.slug === slug) || posts[0];
  }, [slug]);

  const relatedPosts = useMemo(() => {
    return posts
      .filter((p) => p.slug !== post?.slug && (p.category === post?.category || true))
      .slice(0, 3);
  }, [post]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (post) {
      document.title = `${post.title} | Vefogix Blog`;
    }
  }, [post]);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-fg">Article Not Found</h1>
        <p className="mt-2 text-sm text-muted">The blog post you requested could not be located.</p>
        <Link
          to="/blogs"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-light transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <main className="font-sans bg-background text-fg">
      {/* 1. Header / Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950 text-white py-14 lg:py-20">
        {/* Ambient Blur Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-yellow/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-white/70">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blogs" className="hover:text-white transition-colors">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-accent-yellow font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.category}
            </span>
          </nav>

          {/* Category Pill */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-accent-yellow backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {/* Excerpt subtitle */}
          <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Metadata Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-5 border-t border-white/10 pt-6 text-xs text-white/70">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white text-xs">
                {post.author?.name ? post.author.name.charAt(0) : "V"}
              </div>
              <div className="text-left">
                <p className="font-semibold text-white leading-tight">{post.author?.name || "Editorial Staff"}</p>
                <p className="text-[10px] text-white/60 leading-none">{post.author?.role || "SEO Specialist"}</p>
              </div>
            </div>

            <span className="hidden sm:inline h-4 w-px bg-white/20" />

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent-yellow" />
              <span>{formatDate(post.date)}</span>
            </div>

            <span className="hidden sm:inline h-4 w-px bg-white/20" />

            {/* Read Time */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-yellow" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Body (8 cols) */}
          <article className="lg:col-span-8">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-cream shadow-sm mb-10">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Rich Content Sections */}
            <div className="space-y-8 text-base leading-relaxed text-muted">
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
                  1. The Shifting Landscape of Search Authority
                </h2>
                <p>
                  Search algorithms have transitioned far beyond simple keyword matching and sheer volume.
                  Today, authority scoring models place the heaviest weighting on genuine editorial integrity,
                  the historical semantic relevance of referring domains, and contextual topical clusters.
                </p>
                <p>
                  Securing backlinks from verified publishers with proven organic traffic trajectories
                  signals immediate domain trust, protecting your assets against volatile search updates.
                </p>
              </section>

              {/* Highlight Quote Box */}
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6 sm:p-8 my-8">
                <p className="text-base sm:text-lg italic font-medium text-fg">
                  &ldquo;A single dofollow link from an active, topically focused publication carries more ranking
                  equity than dozens of low-tier directory submissions.&rdquo;
                </p>
                <div className="mt-3 text-xs font-semibold text-primary">
                  — Vefogix Search &amp; Outreach Strategy Group
                </div>
              </div>

              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
                  2. Key Pillars of Sustainable Link Building
                </h2>
                <p>
                  To maximize conversion rates and keyword rankings from your outreach campaigns, align your
                  workflow with these four non-negotiable guidelines:
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-fg">Targeted Niche Relevancy</h3>
                      <p className="text-xs text-muted mt-1 leading-normal">
                        Ensure publisher domains demonstrate topical alignment with your brand category and audience interest.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-fg">Natural Anchor Text Distribution</h3>
                      <p className="text-xs text-muted mt-1 leading-normal">
                        Blend branded, target keywords, and conversational phrases to maintain a healthy and authentic profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-fg">Verified Organic Traffic</h3>
                      <p className="text-xs text-muted mt-1 leading-normal">
                        Verify that referring host domains sustain steady monthly search visits across authoritative tracking indexes.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
                  3. Practical Execution &amp; Long-Term Compounding
                </h2>
                <p>
                  When launching a guest post or press release campaign, consistent pacing beats bursts of aggressive placement.
                  Plan your acquisition roadmap over 3 to 6-month cycles, monitoring both keyword movement and primary referral flow.
                </p>
              </section>

              {/* Tags Section */}
              <div className="border-t border-border pt-6 mt-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-fg mr-1 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-muted" /> Tags:
                  </span>
                  {popularTags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-cream px-3 py-1 text-xs font-medium text-muted border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share & Back Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border pt-6 gap-4">
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to All Articles</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Article URL copied to clipboard!");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-fg hover:bg-cream transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5 text-muted" />
                    <span>Share Article</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar Area (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Publisher Marketplace CTA Card */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-cream/60 p-6 shadow-xs">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>Search Growth</span>
              </div>
              <h3 className="text-base font-bold text-fg">Ready to scale your backlinks?</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Explore thousands of verified publishers with live domain metrics and guaranteed turnaround times.
              </p>
              <Link
                to="/marketplace"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-light transition-colors"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Categories Widget */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to="/blogs"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-fg hover:bg-cream transition-colors"
                  >
                    <span>{cat}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles Card */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                Recommended Reading
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/blogs/${rel.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream border border-border">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-primary">{rel.category}</span>
                      <h4 className="text-xs font-semibold text-fg line-clamp-2 group-hover:text-primary transition-colors leading-snug mt-0.5">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-muted mt-1">{formatDate(rel.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. Bottom Newsletter Section */}
      <NewsletterSection newsletter={newsletter} />
    </main>
  );
};

export default BlogDetail;
