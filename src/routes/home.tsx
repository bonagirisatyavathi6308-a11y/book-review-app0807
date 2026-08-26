import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookRow } from "@/components/BookCard";
import { searchBooks, type Book } from "@/lib/books.functions";
import { useProfile } from "@/lib/store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your reading feed — Book Review" },
      {
        name: "description",
        content: "A personalised feed of books from your favourite authors and categories, powered by Google Books.",
      },
      { property: "og:title", content: "Your reading feed — Book Review" },
      { property: "og:description", content: "Browse books by your favourite authors and categories." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { profile, ready } = useProfile();
  const authors = profile.authors.length ? profile.authors.slice(0, 4) : ["Agatha Christie", "Paulo Coelho"];
  const categories = profile.categories.length ? profile.categories.slice(0, 4) : ["Fiction", "Mystery"];

  const authorQueries = useQueries({
    queries: authors.map((a) => ({
      queryKey: ["books", "author", a],
      queryFn: () => searchBooks({ data: { query: `inauthor:"${a}"`, maxResults: 12 } }),
      enabled: ready,
      staleTime: 5 * 60_000,
    })),
  });

  const categoryQueries = useQueries({
    queries: categories.map((c) => ({
      queryKey: ["books", "category", c],
      queryFn: () => searchBooks({ data: { query: `subject:"${c}"`, maxResults: 12 } }),
      enabled: ready,
      staleTime: 5 * 60_000,
    })),
  });

  const trending = useQueries({
    queries: [
      {
        queryKey: ["books", "trending"],
        queryFn: () => searchBooks({ data: { query: "bestseller novels", maxResults: 14, orderBy: "newest" as const } }),
        staleTime: 5 * 60_000,
      },
    ],
  })[0];

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-3">
        <section className="mt-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <h1 className="font-display text-2xl font-bold">
            Hi {profile.name || "reader"} 👋
          </h1>
          <p className="mt-1 text-sm text-foreground/80">
            Fresh picks based on the authors and genres you love.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 px-1 font-display text-lg font-bold">Favourite authors</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {authors.map((a, i) => {
              const cover = (authorQueries[i]?.data as Book[] | undefined)?.[0]?.thumbnail;
              return (
                <Link
                  key={a}
                  to="/author/$authorName"
                  params={{ authorName: a }}
                  className="press flex w-24 shrink-0 flex-col items-center gap-2"
                >
                  <span className="h-20 w-20 overflow-hidden rounded-full border-4 border-accent bg-secondary">
                    {cover ? (
                      <img src={cover} alt={a} className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-display text-xl font-bold text-primary">
                        {a.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 text-center text-xs font-semibold">{a}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {categories.map((c, i) => (
          <BookRow
            key={c}
            title={c}
            books={(categoryQueries[i]?.data as Book[] | undefined) ?? []}
            loading={categoryQueries[i]?.isPending ?? false}
          />
        ))}

        <BookRow
          title="Trending now"
          books={(trending.data as Book[] | undefined) ?? []}
          loading={trending.isPending}
        />

        <footer className="mt-10 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold">About us</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Book Review is a cosy corner for readers to discover books, watch promos and share
            honest text or audio reviews with the community.
          </p>
          <a
            href="mailto:hello@bookreview.app"
            className="press mt-3 inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
          >
            <Mail className="h-4 w-4" /> hello@bookreview.app
          </a>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
}
