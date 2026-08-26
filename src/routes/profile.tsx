import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useProfile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Book Review" },
      { name: "description", content: "View your Book Review profile, reading history and reviews." },
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
  return (
    <div className="min-h-screen pb-28">
      <AppHeader showSearch={false} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">{profile.name || "Reader"}</h1>
        <p className="mt-2 text-muted-foreground">{profile.email || "Your reading profile"}</p>
      </main>
      <BottomNav />
    </div>
  );
}