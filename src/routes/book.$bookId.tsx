import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookCover, BookRow } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { getBook, searchBooks, type Book } from "@/lib/books.functions";
import { trackVisit, useReviews } from "@/lib/store";

export const Route = createFileRoute("/book/$bookId")({
  head: () => ({
    meta: [
      { title: "Book details — Book Review" },
      { name: "description", content: "Read book details and community reviews." },
      { property: "og:title", content: "Book details — Book Review" },
      { property: "og:description", content: "Explore a book and its community reviews." },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookPage,
});

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-secondary px-3 py-2 text-center">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-bold">{value}/5</p>
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
    queryKey: ["book", "more", author],
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
              <div className="aspect-2/3 w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                <BookCover book={book} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-xl font-bold leading-tight">{book.title}</h1>
                {book.authors[0] ? (
                  <Link
                    to="/author/$authorName"
                    params={{ authorName: book.authors[0] }}
                    className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {book.authors.join(", ")}
                  </Link>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {[book.publisher, book.publishedDate?.slice(0, 4), book.categories[0]]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {book.averageRating ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {book.averageRating}
                  </p>
                ) : null}
                <Button asChild size="sm" className="mt-3">
                  <Link to="/upload-review">Write a review</Link>
                </Button>
              </div>
            </section>

            {book.description ? (
              <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
                <h2 className="font-display text-lg font-bold">Synopsis</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {book.description.replace(/<[^>]+>/g, "")}
                </p>
              </section>
            ) : null}

            <section className="mt-5">
              <h2 className="px-1 font-display text-lg font-bold">
                Community reviews ({bookReviews.length})
              </h2>
              {bookReviews.length === 0 ? (
                <p className="mt-2 rounded-3xl bg-card p-4 text-sm text-muted-foreground shadow-soft">
                  No reviews yet — be the first to share your thoughts.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {bookReviews.map((r) => (
                    <li key={r.id} className="rounded-3xl bg-card p-4 shadow-soft">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">
                          {r.audience}
                        </span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Score label="Clarity" value={r.understandability} />
                        <Score label="Interest" value={r.interest} />
                        <Score label="Recommend" value={r.suggestibility} />
                      </div>
                      {r.comment ? <p className="mt-3 text-sm">{r.comment}</p> : null}
                      {r.audioUrl ? (
                        <audio src={r.audioUrl} controls className="mt-3 w-full" />
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {more.length ? (
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
