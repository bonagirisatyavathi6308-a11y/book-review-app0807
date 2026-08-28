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
        content: "View your Book Review profile, watched history and the reviews you submitted.",
      },
      { property: "og:title", content: "Your profile — Book Review" },
      { property: "og:description", content: "Your reading activity, history and reviews." },
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

  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="flex items-center gap-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-accent bg-card font-display text-2xl font-bold text-primary">
            {(profile.name || "R").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold">{profile.name || "Reader"}</h1>
            <p className="text-sm text-foreground/80">{profile.email || "Your reading profile"}</p>
            <p className="mt-1 text-xs text-foreground/70">
              {history.length} viewed · {reviews.length} reviews · {profile.language}
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
              <p className="rounded-3xl bg-card p-5 text-sm text-muted-foreground shadow-soft">
                No books viewed yet. Explore the home feed to get started.
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {history.map((h) => (
                    <li key={h.id}>
                      <Link
                        to="/book/$bookId"
                        params={{ bookId: h.id }}
                        className="press flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft"
                      >
                        <span className="aspect-2/3 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          {h.thumbnail ? (
                            <img src={h.thumbnail} alt={h.title} className="h-full w-full object-cover" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-1 block text-sm font-bold">{h.title}</span>
                          <span className="line-clamp-1 block text-xs text-muted-foreground">
                            {h.authors[0] ?? "Unknown author"} ·{" "}
                            {new Date(h.viewedAt).toLocaleDateString()}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="mt-3" onClick={clearHistory}>
                  Clear history
                </Button>
              </>
            )}
          </section>
        ) : (
          <section className="mt-4">
            {reviews.length === 0 ? (
              <p className="rounded-3xl bg-card p-5 text-sm text-muted-foreground shadow-soft">
                You haven&apos;t submitted any reviews yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl bg-card p-3 shadow-soft">
                    <div className="flex items-start gap-3">
                      <Link
                        to="/book/$bookId"
                        params={{ bookId: r.bookId }}
                        className="aspect-2/3 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary"
                      >
                        {r.thumbnail ? (
                          <img src={r.thumbnail} alt={r.bookTitle} className="h-full w-full object-cover" />
                        ) : null}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-bold">{r.bookTitle}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {r.audience} · {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                        {r.comment ? <p className="mt-1 text-sm">{r.comment}</p> : null}
                        {r.audioUrl ? (
                          <audio src={r.audioUrl} controls className="mt-2 w-full" />
                        ) : null}
                      </div>
                      <button
                        aria-label="Delete review"
                        onClick={() => removeReview(r.id)}
                        className="press rounded-xl p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
