import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../sheared/SectionHeading";

const formatDate = (dateStr) => {
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
      new Date(dateStr)
    );
  } catch {
    return dateStr;
  }
};

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Featured Insight"
          title="Top Editorial Pick"
          description="Hand-picked strategy from our search intelligence and content syndication team."
        />

        <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md">
          <div className="grid md:grid-cols-12">
            {/* Image side */}
            <div className="relative aspect-[16/10] bg-gray-50 md:aspect-auto md:col-span-6 lg:col-span-7">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.classList.remove("hidden");
                  }
                }}
                className="h-full w-full object-cover"
              />
              {/* Fallback box */}
              <div
                aria-hidden="true"
                className="hidden h-full w-full flex-col items-center justify-center bg-cream/60 p-8 text-center"
              >
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <p className="mt-3 text-lg font-bold text-fg line-clamp-2">
                  {post.title}
                </p>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-col justify-between p-6 md:col-span-6 md:p-8 lg:col-span-5 lg:p-10">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full border border-border bg-gray-50 px-3 py-1 text-xs font-semibold text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-fg md:text-3xl">
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="transition hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & CTA Footer */}
              <div className="mt-8 border-t border-border pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-fg">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.date)} • {post.author.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FeaturedPost;

