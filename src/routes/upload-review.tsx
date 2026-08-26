import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/upload-review")({
  head: () => ({
    meta: [
      { title: "Share a review — Book Review" },
      { name: "description", content: "Submit a written or audio book review." },
      { property: "og:title", content: "Share a review — Book Review" },
      { property: "og:description", content: "Share your thoughts about your latest read." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadReviewPage,
});

function UploadReviewPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Share a review</h1>
        <p className="mt-2 text-muted-foreground">Choose a book to start your review.</p>
      </main>
      <BottomNav />
    </div>
  );
}