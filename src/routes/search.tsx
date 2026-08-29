import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useT } from "@/lib/i18n";
import BottomNav from "@/components/BottomNav";
import { BookCard } from "@/components/BookCard";
import { searchBooks } from "@/lib/books.functions";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search books — Book Review" },
      { name: "description", content: "Search for books and authors on Book Review." },
      { property: "og:title", content: "Search books — Book Review" },
      { property: "og:description", content: "Find books and authors to read and review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q);

  // Keep the input in sync when the URL changes (header search, back button).
  useEffect(() => {
    setTerm(q);
  }, [q]);

  // Debounce typing into the URL so the query key stays stable.
  useEffect(() => {
    if (term === q) return;
    const t = setTimeout(() => {
      void navigate({ to: ".", search: { q: term }, replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [term, q, navigate]);

  const query = q.trim();
  const { data, isFetching, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchBooks({ data: { query, maxResults: 24 } }),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const books = data ?? [];
  const { t } = useT();

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="font-display text-2xl font-bold">{t("search.title")}</h1>

        <div className="relative mt-4">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label="Search books"
            className="w-full rounded-full border border-border bg-card py-3 pl-10 pr-10 text-sm shadow-soft outline-none transition focus:ring-2 focus:ring-primary/40"
          />
          {term ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setTerm("")}
              className="press absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {!query ? (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">{t("search.hint")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 10).map((c) => {
                const label = typeof c === "string" ? c : String((c as { name?: string }).name ?? c);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTerm(label)}
                    className="press rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : isFetching && books.length === 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-secondary" />
            ))}
          </div>
        ) : isError ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Couldn’t reach the book service. Please try again.
          </p>
        ) : books.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">{t("search.noResults")} “{query}”.</p>
        ) : (
          <>
            <p className="mt-5 text-sm text-muted-foreground">
              {books.length} results for “{query}”
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {books.map((b) => (
                <BookCard key={b.id} book={b} wide />
              ))}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
