import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

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
  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Search</h1>
        <p className="mt-2 text-muted-foreground">
          {q ? `Showing results for “${q}”` : "Search for a title or author above."}
        </p>
      </main>
      <BottomNav />
    </div>
  );
}