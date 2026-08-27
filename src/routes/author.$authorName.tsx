import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookCard } from "@/components/BookCard";
import { searchBooks, type Book } from "@/lib/books.functions";

export const Route = createFileRoute("/author/$authorName")({
  head: () => ({
    meta: [
      { title: "Author profile — Book Review" },
      { name: "description", content: "Discover an author, their popular books and suggestions." },
      { property: "og:title", content: "Author profile — Book Review" },
      { property: "og:description", content: "Explore an author and their books." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthorPage,
});

function Grid({ books, loading }: { books: Book[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    );
  }
  if (!books.length) {
    return <p className="mt-3 text-sm text-muted-foreground">Nothing to show here yet.</p>;
  }
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {books.map((b) => (
        <BookCard key={b.id} book={b} wide />
      ))}
    </div>
  );
}

function AuthorPage() {
  const { authorName } = Route.useParams();
  const search = useServerFn(searchBooks);

  const { data: books = [], isPending } = useQuery({
    queryKey: ["author", authorName],
    queryFn: () => search({ data: { query: `inauthor:"${authorName}"`, maxResults: 40 } }),
    staleTime: 5 * 60_000,
  });

  const list = books as Book[];
  const popular = [...list]
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 8);
  const popularIds = new Set(popular.map((b) => b.id));
  const rest = list.filter((b) => !popularIds.has(b.id));

  const genre = list.find((b) => b.categories[0])?.categories[0];
  const { data: similar = [] } = useQuery({
    queryKey: ["author", "similar", genre],
    queryFn: () => search({ data: { query: `subject:"${genre}"`, maxResults: 12 } }),
    enabled: Boolean(genre),
    staleTime: 5 * 60_000,
  });

  const suggestions = [
    ...rest,
    ...(similar as Book[]).filter(
      (b) => !popularIds.has(b.id) && !rest.some((r) => r.id === b.id),
    ),
  ].slice(0, 12);

  const initial = authorName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <section className="flex items-center gap-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-accent bg-card">
            {popular[0]?.thumbnail ? (
              <img
                src={popular[0].thumbnail}
                alt={authorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-2xl font-bold text-primary">{initial}</span>
            )}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold leading-tight">{authorName}</h1>
            <p className="mt-1 text-sm text-foreground/80">
              {list.length} books found{genre ? ` · mostly ${genre}` : ""}
            </p>
          </div>
        </section>

        <h2 className="mt-8 px-1 font-display text-lg font-bold">Popular books</h2>
        <Grid books={popular} loading={isPending} />

        <h2 className="mt-8 px-1 font-display text-lg font-bold">Suggestions for you</h2>
        <Grid books={suggestions} loading={isPending} />
      </main>
      <BottomNav />
    </div>
  );
}
