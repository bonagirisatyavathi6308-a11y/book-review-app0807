import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookCard, BookRow } from "@/components/BookCard";
import { searchBooks, type Book } from "@/lib/books.functions";

export const Route = createFileRoute("/author/$authorName")({
  head: () => ({
    meta: [
      { title: "Author profile — Book Review" },
      { name: "description", content: "Discover an author, their popular books and similar reads." },
      { property: "og:title", content: "Author profile — Book Review" },
      { property: "og:description", content: "Explore an author's popular books and suggestions." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  const { authorName } = Route.useParams();
  const search = useServerFn(searchBooks);

  const { data: works = [], isPending } = useQuery({
    queryKey: ["author", authorName, "works"],
    queryFn: () => search({ data: { query: `inauthor:"${authorName}"`, maxResults: 24 } }),
    staleTime: 5 * 60_000,
  });

  const popular = (works as Book[]).slice(0, 8);
  const rest = (works as Book[]).slice(8);
  const genre = popular.find((b) => b.categories[0])?.categories[0];

  const { data: similar = [] } = useQuery({
    queryKey: ["author", authorName, "similar", genre],
    queryFn: () => search({ data: { query: `subject:"${genre}"`, maxResults: 14 } }),
    enabled: Boolean(genre),
    staleTime: 5 * 60_000,
  });

  const avatar = popular[0]?.thumbnail;

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="flex items-center gap-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <span className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-accent bg-secondary">
            {avatar ? (
              <img src={avatar} alt={authorName} className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center font-display text-2xl font-bold text-primary">
                {authorName.charAt(0)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold">{authorName}</h1>
            <p className="mt-1 text-sm text-foreground/80">
              {works.length ? `${works.length}+ titles` : "Author"}
              {genre ? ` · ${genre}` : ""}
            </p>
          </div>
        </section>

        <h2 className="mt-6 mb-3 px-1 font-display text-lg font-bold">Popular books</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {isPending
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-secondary" />
              ))
            : popular.map((b) => <BookCard key={b.id} book={b} wide />)}
        </div>
        {!isPending && popular.length === 0 ? (
          <p className="text-sm text-muted-foreground">No books found for this author.</p>
        ) : null}

        {rest.length ? <BookRow title="More from this author" books={rest} /> : null}
        {similar.length ? (
          <BookRow
            title="You may also like"
            books={(similar as Book[]).filter(
              (b) => !b.authors.includes(authorName) && !works.some((w: Book) => w.id === b.id),
            )}
          />
        ) : null}
      </main>
      <BottomNav />
    </div>
  );
}
