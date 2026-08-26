import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mascot } from "@/components/Logo";
import { isOnboarded } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Book Review — Discover, rate and share books" },
      {
        name: "description",
        content:
          "Book Review lets you explore books from Google Books, follow favourite authors, watch promos and post text or audio reviews.",
      },
      { property: "og:title", content: "Book Review — Discover, rate and share books" },
      {
        property: "og:description",
        content: "Explore books, follow authors and share text or audio reviews.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: isOnboarded() ? "/home" : "/onboarding", replace: true });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-hero px-6 text-center">
      <Mascot className="h-64 w-64 duration-700 animate-in fade-in zoom-in" />
      <h1 className="sr-only">Book Review</h1>
      <p className="font-display text-lg font-bold text-primary">
        Read. Rate. Recommend.
      </p>
      <span className="h-1.5 w-32 overflow-hidden rounded-full bg-primary-soft">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </span>
    </main>
  );
}
