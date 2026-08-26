import { Link } from "@tanstack/react-router";
import type { Book } from "@/lib/books.functions";
import { cn } from "@/lib/utils";

export function BookCover({ book, className }: { book: Book; className?: string }) {
  if (book.thumbnail) {
    return (
      <img
        src={book.thumbnail}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-brand p-2 text-center",
        className,
      )}
    >
      <span className="font-display text-xs leading-tight text-foreground">{book.title}</span>
    </div>
  );
}

export function BookCard({ book, wide = false }: { book: Book; wide?: boolean }) {
  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      className={cn(
        "press group block shrink-0 rounded-2xl bg-card p-2 shadow-soft",
        wide ? "w-full" : "w-32",
      )}
    >
      <div className="aspect-2/3 overflow-hidden rounded-xl bg-secondary">
        <BookCover book={book} className="transition-transform duration-300 group-hover:scale-105" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug">{book.title}</p>
      <p className="line-clamp-1 text-xs text-muted-foreground">
        {book.authors[0] ?? "Unknown author"}
      </p>
      {book.publishedDate ? (
        <p className="text-[11px] text-muted-foreground">{book.publishedDate.slice(0, 4)}</p>
      ) : null}
    </Link>
  );
}

export function BookRow({
  title,
  books,
  loading,
}: {
  title: string;
  books: Book[];
  loading?: boolean;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 px-1 font-display text-lg font-bold">{title}</h2>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-56 w-32 shrink-0 animate-pulse rounded-2xl bg-secondary" />
            ))
          : books.map((b) => (
              <div key={b.id} className="snap-start">
                <BookCard book={b} />
              </div>
            ))}
        {!loading && books.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">Nothing here yet.</p>
        ) : null}
      </div>
    </section>
  );
}
