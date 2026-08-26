import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/promo")({
  head: () => ({
    meta: [
      { title: "Book promos — Book Review" },
      { name: "description", content: "Watch short video promos for books on Book Review." },
      { property: "og:title", content: "Book promos — Book Review" },
      { property: "og:description", content: "Discover your next read through book promos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PromoPage,
});

function PromoPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Book promos</h1>
        <p className="mt-2 text-muted-foreground">Fresh video promos are coming soon.</p>
      </main>
      <BottomNav />
    </div>
  );
}