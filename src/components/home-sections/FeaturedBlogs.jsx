import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import BannerHeading from "../sheared/BannerHeading";
import { featuredBlogs } from "../../data/home";

const FeaturedBlogs = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <BannerHeading align="left" maxWidth="md" eyebrow="Blog" title="Featured" highlight="Blogs" />
        <Link to="/blogs" className="text-sm font-semibold text-primary hover:underline">
          View All Blogs →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {featuredBlogs.map(({ title, excerpt, category, date, to }) => (
          <article key={title} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
            {/* replace with a real cover image later */}
            <div className="flex h-40 items-center justify-center bg-primary/10 text-primary">
              <BookOpen className="h-10 w-10" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{category}</span>
              <h3 className="mt-3">
                <Link to={to} className="hover:text-primary">{title}</Link>
              </h3>
              <p className="mt-2 text-sm text-muted">{excerpt}</p>
              <p className="mt-auto pt-4 text-xs text-muted">{date}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedBlogs;