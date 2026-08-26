import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import AudioRecorder from "@/components/AudioRecorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { searchBooks, type Book } from "@/lib/books.functions";
import { useReviews, type Review } from "@/lib/store";

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

const AUDIENCES: Review["audience"][] = ["Kids", "Youth", "Adults"];

function PollSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold">
          {value}/5
        </span>
      </div>
      <Slider
        className="mt-3"
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? 1)}
      />
    </div>
  );
}

function UploadReviewPage() {
  const navigate = useNavigate();
  const { addReview } = useReviews();

  const [query, setQuery] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const [understandability, setUnderstandability] = useState(3);
  const [interest, setInterest] = useState(3);
  const [suggestibility, setSuggestibility] = useState(3);
  const [audience, setAudience] = useState<Review["audience"]>("Youth");
  const [comment, setComment] = useState("");
  const [audio, setAudio] = useState<{ url: string; seconds: number } | null>(null);

  const words = comment.trim() ? comment.trim().split(/\s+/).length : 0;

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["review-search", query],
    queryFn: () => searchBooks({ data: { query, maxResults: 6 } }),
    enabled: query.trim().length > 2 && !book,
  });

  const submit = () => {
    if (!book) return toast.error("Pick the book you're reviewing.");
    if (words > 100) return toast.error("Keep your comment under 100 words.");
    if (!comment.trim() && !audio) return toast.error("Add a comment or a voice review.");

    const review: Review = {
      id: crypto.randomUUID(),
      bookId: book.id,
      bookTitle: book.title,
      ...(book.thumbnail ? { thumbnail: book.thumbnail } : {}),
      type: audio ? "audio" : "text",
      understandability,
      interest,
      suggestibility,
      audience,
      comment: comment.trim(),
      ...(audio ? { audioUrl: audio.url, audioSeconds: audio.seconds } : {}),
      createdAt: Date.now(),
    };
    addReview(review);
    toast.success("Review shared!");
    void navigate({ to: "/profile" });
  };

  return (
    <div className="min-h-screen pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <header>
          <h1 className="font-display text-2xl font-bold">Share a review</h1>
          <p className="mt-1 text-muted-foreground">
            Rate the book, add your thoughts, and record a 60-second voice note.
          </p>
        </header>

        <section className="rounded-2xl border bg-card p-4 shadow-soft">
          <label className="text-sm font-medium">Book</label>
          {book ? (
            <div className="mt-3 flex items-center gap-3">
              {book.thumbnail && (
                <img src={book.thumbnail} alt={book.title} className="h-20 w-14 rounded-md object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{book.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {book.authors.join(", ") || "Unknown author"}
                </p>
              </div>
              <Button variant="ghost" className="press" onClick={() => setBook(null)}>
                Change
              </Button>
            </div>
          ) : (
            <>
              <Input
                className="mt-2"
                placeholder="Search a title or author…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isFetching && <p className="mt-2 text-sm text-muted-foreground">Searching…</p>}
              <ul className="mt-2 space-y-1">
                {results.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => setBook(b)}
                      className="press flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted"
                    >
                      {b.thumbnail && (
                        <img src={b.thumbnail} alt={b.title} className="h-14 w-10 rounded object-cover" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{b.title}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {b.authors.join(", ")}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="space-y-5 rounded-2xl border bg-card p-4 shadow-soft">
          <PollSlider label="Easy to understand" value={understandability} onChange={setUnderstandability} />
          <PollSlider label="How interesting" value={interest} onChange={setInterest} />
          <PollSlider label="Would you suggest it" value={suggestibility} onChange={setSuggestibility} />
        </section>

        <section className="rounded-2xl border bg-card p-4 shadow-soft">
          <p className="text-sm font-medium">Best suited for</p>
          <div className="mt-3 flex gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a)}
                className={`press rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  audience === a ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Your thoughts</label>
            <span className={`text-sm ${words > 100 ? "text-destructive" : "text-muted-foreground"}`}>
              {words}/100 words
            </span>
          </div>
          <Textarea
            className="mt-2 min-h-32"
            placeholder="What did you love about this book?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </section>

        <AudioRecorder onChange={setAudio} />

        <Button className="press w-full" size="lg" onClick={submit}>
          Publish review
        </Button>
      </main>
      <BottomNav />
    </div>
  );
}
