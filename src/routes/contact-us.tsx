import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — Book Review" },
      {
        name: "description",
        content: "Reach the Book Review team by phone or email — Satyavathi, 8099340914.",
      },
      { property: "og:title", content: "Contact Us — Book Review" },
      { property: "og:description", content: "Reach the Book Review team by phone or email." },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-3">
        <section className="mt-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <h1 className="font-display text-2xl font-bold">Contact Us</h1>
          <p className="mt-1 text-sm text-foreground/80">
            We usually reply within a day or two.
          </p>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <a
            href="tel:+918099340914"
            className="press rounded-3xl bg-card p-5 shadow-soft"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary">
              <Phone className="h-5 w-5 text-primary" />
            </span>
            <h2 className="mt-3 font-display font-bold">Call us</h2>
            <p className="mt-1 text-sm font-semibold text-primary">8099340914</p>
            <p className="text-xs text-muted-foreground">Tap to call on mobile</p>
          </a>

          <a
            href="mailto:appdevelopeverbonagiri@gmail.com"
            className="press rounded-3xl bg-card p-5 shadow-soft"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary">
              <Mail className="h-5 w-5 text-primary" />
            </span>
            <h2 className="mt-3 font-display font-bold">Email us</h2>
            <p className="mt-1 break-all text-sm font-semibold text-primary">
              appdevelopeverbonagiri@gmail.com
            </p>
            <p className="text-xs text-muted-foreground">Tap to open your mail app</p>
          </a>
        </div>

        <article className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold">Write to Satyavathi</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Have a bug to report, a book to suggest, or feedback about your review experience?
            Send a message and Satyavathi will get back to you.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/about-us"
              className="press inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-bold"
            >
              About us
            </Link>
            <Link
              to="/privacy-policy"
              className="press inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-bold"
            >
              Privacy policy
            </Link>
          </div>
        </article>
      </main>
      <BottomNav />
    </div>
  );
}
