import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useHistory, useProfile, useReviews } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Book Review" },
      {
        name: "description",
        content: "View your Book Review profile, watched history and submitted reviews.",
      },
      { property: "og:title", content: "Your profile — Book Review" },
      { property: "og:description", content: "Your reading activity and reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile } = useProfile();
  const { history, clearHistory } = useHistory();
  const { reviews, removeReview } = useReviews();
  const [tab, setTab] = useState<"history" | "reviews">("history");

  const initial = (profile.name || "R").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="flex items-center gap-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-accent bg-card font-display text-2xl font-bold text-primary">
            {initial}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold">{profile.name || "Reader"}</h1>
            <p className="text-sm text-foreground/80">
              {profile.email || "Your reading profile"}
            </p>
            <p className="mt-1 text-xs text-foreground/70">
              {history.length} books viewed · {reviews.length} reviews · {profile.language}
            </p>
          </div>
        </section>

        {profile.categories.length || profile.authors.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {[...profile.categories, ...profile.authors].map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex gap-2 rounded-2xl bg-secondary p-1">
          {(["history", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`press flex-1 rounded-xl px-3 py-2 text-sm font-bold capitalize ${
                tab === t ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              {t === "history" ? "Watched history" : "My reviews"}
            </button>
          ))}
        </div>

        {tab === "history" ? (
          <section className="mt-4">
            {history.length === 0 ? (
              <p className="rounded-3xl bg-card p-4 text-sm text-muted-foreground shadow-soft">
                No books viewed yet. Start exploring from the home feed.
              </p>
            ) : (
              <>
                <div className="mb-3 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={clearHistory}>
                    Clear history
                  </Button>
                </div>
                <ul className="space-y-3">
                  {history.map((h) => (
                    <li key={h.id}>
                      <Link
                        to="/book/$bookId"
                        params={{ bookId: h.id }}
                        className="press flex items-center gap-3 rounded-3xl bg-card p-3 shadow-soft"
                      >
                        <span className="aspect-2/3 w-12 overflow-hidden rounded-xl bg-secondary">
                          {h.thumbnail ? (
                            <img
                              src={h.thumbnail}
                              alt={`Cover of ${h.title}`}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 block text-sm font-bold">{h.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {h.authors[0] ?? "Unknown author"} ·{" "}
                            {new Date(h.viewedAt).toLocaleDateString()}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ) : (
          <section className="mt-4">
            {reviews.length === 0 ? (
              <p className="rounded-3xl bg-card p-4 text-sm text-muted-foreground shadow-soft">
                You haven&apos;t written a review yet.{" "}
                <Link to="/upload-review" className="font-bold text-primary">
                  Write one
                </Link>
                .
              </p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-3xl bg-card p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to="/book/$bookId"
                        params={{ bookId: r.bookId }}
                        className="min-w-0 font-bold leading-snug hover:underline"
                      >
                        {r.bookTitle}
                      </Link>
                      <button
                        aria-label="Delete review"
                        onClick={() => removeReview(r.id)}
                        className="press text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.audience} · {new Date(r.createdAt).toLocaleDateString()} · clarity{" "}
                      {r.understandability}/5 · interest {r.interest}/5 · recommend{" "}
                      {r.suggestibility}/5
                    </p>
                    {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
                    {r.audioUrl ? <audio src={r.audioUrl} controls className="mt-2 w-full" /> : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
