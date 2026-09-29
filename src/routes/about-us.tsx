import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, UserRound } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — Book Review" },
      {
        name: "description",
        content: "Meet Satyavathi, the developer behind Book Review, and learn what the app is about.",
      },
      { property: "og:title", content: "About Us — Book Review" },
      { property: "og:description", content: "Meet Satyavathi, the developer behind Book Review." },
    ],
  }),
  component: AboutUsPage,
});

function AboutUsPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-3">
        <section className="mt-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <h1 className="font-display text-2xl font-bold">About Us</h1>
          <p className="mt-1 text-sm text-foreground/80">
            A cosy home for honest book reviews, powered by real readers.
          </p>
        </section>

        <article className="mt-5 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold">Our story</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Book Review helps readers discover books through the eyes of the community. Browse titles
            from Google Books, watch animated teasers, record voice reviews, and keep a history of
            everything you read — all in one friendly place.
          </p>
        </article>

        <article className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold">Meet the developer</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent font-display text-xl font-bold text-accent-foreground">
              <UserRound className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-base font-bold">Satyavathi</p>
              <p className="text-xs text-muted-foreground">App Developer, Book Review</p>
            </div>
          </div>
          <a
            href="mailto:appdevelopeverbonagiri@gmail.com"
            className="press mt-4 inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
          >
            <Mail className="h-4 w-4" /> appdevelopeverbonagiri@gmail.com
          </a>
        </article>

        <article className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold">Get in touch</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Questions or feedback? We would love to hear from you.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:+918099340914"
              className="press inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-bold"
            >
              <Phone className="h-4 w-4 text-primary" /> 8099340914
            </a>
            <Link
              to="/contact-us"
              className="press inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-bold"
            >
              Contact page
            </Link>
          </div>
        </article>
      </main>
      <BottomNav />
    </div>
  );
}
