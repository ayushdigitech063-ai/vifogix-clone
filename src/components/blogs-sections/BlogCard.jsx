import { Link } from "react-router-dom";

const formatDate = (dateStr) => {
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
      new Date(dateStr)
    );
  } catch {
    return dateStr;
  }
};

const BlogCard = ({ post }) => {
  const authorInitials = post.author?.name
    ? post.author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "V";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md">
      {/* Top Image area */}
      <Link to={`/blogs/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-50">
        <img
          src={post.image}
          alt={post.title}
          title={post.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.classList.remove("hidden");
            }
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* Fallback block */}
        <div
          aria-hidden="true"
          className="hidden h-full w-full flex-col items-center justify-center bg-gray-100 p-4 text-center"
        >
          <span className="text-2xl font-bold text-primary/40">VEFOGIX</span>
        </div>

        {/* Category Pill over image */}
        <span className="absolute left-3 top-3 rounded-full border border-border/80 bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-sm">
          {post.category}
        </span>
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-fg group-hover:text-primary transition-colors">
            <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {authorInitials}
            </div>
            <span className="truncate font-medium text-fg">{post.author?.name}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

