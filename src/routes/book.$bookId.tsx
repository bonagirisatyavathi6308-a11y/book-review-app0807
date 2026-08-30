import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookCover, BookRow } from "@/components/BookCard";
import BookTeaser from "@/components/BookTeaser";
import { Button } from "@/components/ui/button";
import { getBook, searchBooks, type Book } from "@/lib/books.functions";
import { trackVisit, useReviews } from "@/lib/store";

export const Route = createFileRoute("/book/$bookId")({
  head: () => ({
    meta: [
      { title: "Book details — Book Review" },
      { name: "description", content: "Read the synopsis and community reviews for this book." },
      { property: "og:title", content: "Book details — Book Review" },
      { property: "og:description", content: "Explore a book and its community reviews." },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookPage,
});

function Poll({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}

function BookPage() {
  const { bookId } = Route.useParams();
  const fetchBook = useServerFn(getBook);
  const search = useServerFn(searchBooks);
  const { reviews } = useReviews();

  const { data: book, isPending } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBook({ data: { id: bookId } }),
    staleTime: 5 * 60_000,
  });

  const author = book?.authors[0];
  const { data: more = [] } = useQuery({
    queryKey: ["book", bookId, "more", author],
    queryFn: () => search({ data: { query: `inauthor:"${author}"`, maxResults: 12 } }),
    enabled: Boolean(author),
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!book) return;
    trackVisit({
      id: book.id,
      title: book.title,
      authors: book.authors,
      ...(book.thumbnail ? { thumbnail: book.thumbnail } : {}),
    });
  }, [book]);

  const bookReviews = reviews.filter((r) => r.bookId === bookId);

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        {isPending || !book ? (
          <div className="h-64 animate-pulse rounded-3xl bg-secondary" />
        ) : (
          <>
            <section className="flex gap-4 rounded-3xl bg-card p-4 shadow-soft">
              <div className="aspect-2/3 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <BookCover book={book} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-xl font-bold leading-snug">{book.title}</h1>
                {book.subtitle ? (
                  <p className="text-sm text-muted-foreground">{book.subtitle}</p>
                ) : null}
                {book.authors[0] ? (
                  <Link
                    to="/author/$authorName"
                    params={{ authorName: book.authors[0] }}
                    className="mt-1 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {book.authors.join(", ")}
                  </Link>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {[book.publisher, book.publishedDate?.slice(0, 4), book.pageCount ? `${book.pageCount} pages` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {book.averageRating ? (
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {book.averageRating}
                  </p>
                ) : null}
                <Link to="/upload-review" className="mt-3 inline-block">
                  <Button size="sm">Write a review</Button>
                </Link>
              </div>
            </section>

            {book.description ? (
              <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
                <h2 className="font-display text-lg font-bold">Synopsis</h2>
                <div
                  className="mt-2 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </section>
            ) : null}

            <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
              <h2 className="font-display text-lg font-bold">
                Community reviews ({bookReviews.length})
              </h2>
              {bookReviews.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No reviews yet — be the first to share your thoughts.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {bookReviews.map((r) => (
                    <li key={r.id} className="rounded-2xl bg-secondary/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
                          {r.audience}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
                      {r.audioUrl ? (
                        <audio src={r.audioUrl} controls className="mt-2 w-full" />
                      ) : null}
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Poll label="Understandable" value={r.understandability} />
                        <Poll label="Interest" value={r.interest} />
                        <Poll label="Would suggest" value={r.suggestibility} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {author ? (
              <BookRow
                title={`More by ${author}`}
                books={(more as Book[]).filter((b) => b.id !== book.id)}
              />
            ) : null}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
