import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/author/$authorName")({
  head: () => ({
    meta: [
      { title: "Author profile — Book Review" },
      { name: "description", content: "Discover an author and their published works." },
      { property: "og:title", content: "Author profile — Book Review" },
      { property: "og:description", content: "Explore an author and their books." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  const { authorName } = Route.useParams();
  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">{authorName}</h1>
        <p className="mt-2 text-muted-foreground">Author profile and published works.</p>
      </main>
      <BottomNav />
    </div>
  );
}