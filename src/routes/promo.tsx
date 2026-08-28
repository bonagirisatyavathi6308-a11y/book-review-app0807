import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { BookCover } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { searchBooks, type Book } from "@/lib/books.functions";
import { startBookPromo, getBookPromo, type PromoStatus } from "@/lib/promo.functions";

export const Route = createFileRoute("/promo")({
  head: () => ({
    meta: [
      { title: "Book video promos — Book Review" },
      {
        name: "description",
        content: "Generate short cinematic video promos for the books you love on Book Review.",
      },
      { property: "og:title", content: "Book video promos — Book Review" },
      {
        property: "og:description",
        content: "Pick a book and watch an AI-made teaser trailer in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PromoPage,
});

function PromoPage() {
  const search = useServerFn(searchBooks);
  const start = useServerFn(startBookPromo);
  const poll = useServerFn(getBookPromo);

  const [selected, setSelected] = useState<Book | null>(null);
  const [job, setJob] = useState<PromoStatus | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["promo-picks"],
    queryFn: () => search({ data: { query: "bestselling fiction", maxResults: 12 } }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const fail = (message: string) => {
    setBusy(false);
    setFailure(message);
    toast.error(message);
  };

  const track = (id: string) => {
    timer.current = setTimeout(async () => {
      try {
        const next = await poll({ data: { id } });
        setJob(next);
        if (next.status === "in_progress") track(id);
        else {
          setBusy(false);
          if (next.status === "failed") fail(next.error ?? "Promo generation failed.");
        }
      } catch (error) {
        fail(error instanceof Error ? error.message : "Promo generation failed.");
      }
    }, 7000);
  };

  const generate = async (book: Book) => {
    if (busy) return;
    setSelected(book);
    setJob(null);
    setFailure(null);
    setBusy(true);
    try {
      const created = await start({
        data: {
          title: book.title,
          authors: book.authors,
          categories: book.categories,
          ...(book.description ? { description: book.description } : {}),
        },
      });
      setJob(created);
      if (created.status === "failed") {
        fail(created.error ?? "Promo generation is unavailable.");
        return;
      }
      track(created.id);
    } catch (error) {
      fail(error instanceof Error ? error.message : "Could not start the promo.");
    }
  };


  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="font-display text-2xl font-bold">Book promos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a book and we&apos;ll craft a 6-second cinematic teaser for it.
        </p>

        {selected ? (
          <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
            <div className="flex gap-3">
              <div className="aspect-2/3 w-16 overflow-hidden rounded-xl bg-secondary">
                <BookCover book={selected} />
              </div>
              <div className="min-w-0">
                <p className="font-bold leading-snug">{selected.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.authors[0] ?? "Unknown author"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {failure
                    ? "Couldn't generate this promo"
                    : job?.status === "completed"
                      ? "Promo ready"
                      : "Generating… this usually takes 1–3 minutes"}
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl bg-secondary">
              {failure ? (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <p className="text-sm font-bold">Promo unavailable</p>
                  <p className="text-xs text-muted-foreground">{failure}</p>
                </div>
              ) : job?.status === "completed" && job.url ? (
                <video
                  key={job.id}
                  src={job.url}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
            </div>
          </section>
        ) : null}

        <h2 className="mt-8 font-display text-lg font-bold">Choose a book</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-secondary" />
              ))
            : books.map((book) => (
                <div key={book.id} className="rounded-2xl bg-card p-2 shadow-soft">
                  <div className="aspect-2/3 overflow-hidden rounded-xl bg-secondary">
                    <BookCover book={book} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug">{book.title}</p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    disabled={busy}
                    onClick={() => generate(book)}
                  >
                    {busy && selected?.id === book.id ? "Generating…" : "Generate promo"}
                  </Button>
                </div>
              ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
