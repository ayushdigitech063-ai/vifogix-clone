
const Pagination = ({ page, totalPages, onChange }) => {
     if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base = "h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${base} border-border bg-surface text-muted hover:border-primary-light disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${base} ${
            p === page
              ? "border-primary bg-primary text-white"
              : "border-border bg-surface text-muted hover:border-primary-light"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${base} border-border bg-surface text-muted hover:border-primary-light disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Next
      </button>
    </nav>
  );
}
export default Pagination;