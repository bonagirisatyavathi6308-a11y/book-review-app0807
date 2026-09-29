import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Book Review" },
      {
        name: "description",
        content: "How Book Review collects, uses, and protects your information.",
      },
      { property: "og:title", content: "Privacy Policy — Book Review" },
      { property: "og:description", content: "How Book Review collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPolicyPage,
});

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Information We Collect",
    body: "Book Review collects the details you provide during onboarding, such as your name, email address, age group, gender, favourite authors, categories, and preferred language. We also store your browsing history, the reviews you submit, and any audio recordings you attach to a review, all saved locally on your device.",
  },
  {
    title: "2. How We Use Your Information",
    body: "The information you provide is used to personalise your reading feed, remember your preferences and language, keep a record of books you have viewed and reviews you have written, and improve the overall experience of the app.",
  },
  {
    title: "3. Local Storage of Data",
    body: "Your profile, onboarding answers, browsing history, and submitted reviews are stored on your device using local browser storage. This data is not uploaded to our servers, and clearing your browser data or logging out removes it from your device.",
  },
  {
    title: "4. Third-Party Services",
    body: "Book details, cover images, and author information are fetched in real time from the Google Books API. When you search or browse, your search terms are sent to Google Books to retrieve results. We do not share your personal profile with third parties.",
  },
  {
    title: "5. Audio Recordings",
    body: "Audio reviews are recorded using your device microphone only when you explicitly press record. Recordings remain on your device and are attached only to the review you submit. You can delete any review and its recording from your profile at any time.",
  },
  {
    title: "6. Children's Privacy",
    body: "Book Review is intended for general audiences. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us so we can remove it.",
  },
  {
    title: "7. Your Choices",
    body: "You can update your profile and preferences at any time, change your language, delete individual reviews and history entries, or log out to clear your local data from the device.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Continued use of Book Review after changes are published means you accept the updated policy.",
  },
  {
    title: "9. Contact Us",
    body: "If you have questions about this Privacy Policy, contact Satyavathi at appdevelopeverbonagiri@gmail.com or call 8099340914.",
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-3">
        <section className="mt-4 rounded-3xl bg-gradient-brand p-5 shadow-soft">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-bold">
            <Shield className="h-4 w-4 text-primary" /> Privacy Policy
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold">Your privacy matters</h1>
          <p className="mt-1 text-sm text-foreground/80">
            How Book Review collects, uses, and protects your information.
          </p>
        </section>

        <div className="mt-5 space-y-4">
          {SECTIONS.map((s) => (
            <article key={s.title} className="rounded-3xl bg-card p-5 shadow-soft">
              <h2 className="font-display font-bold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
          <p className="px-2 text-xs text-muted-foreground">Last updated: September 2026</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
