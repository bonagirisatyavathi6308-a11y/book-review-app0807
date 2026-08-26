import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

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

function BookPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Book details</h1>
        <p className="mt-2 text-muted-foreground">Loading book information…</p>
      </main>
      <BottomNav />
    </div>
  );
}