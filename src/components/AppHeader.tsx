import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search as SearchIcon, X, Globe, LogOut, UserCog } from "lucide-react";
import { useState } from "react";
import { Mascot } from "@/components/Logo";
import { useProfile, LANGUAGES } from "@/lib/store";

export function AppHeader({ showSearch = true }: { showSearch?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { profile, saveProfile, clearProfile } = useProfile();
  const initial = profile.name?.trim().charAt(0).toUpperCase() || "B";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-3 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="press rounded-full p-2 text-foreground hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>

          {showSearch ? (
            <form
              className="relative flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/search", search: { q } });
              }}
            >
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search books or authors"
                aria-label="Search books"
                className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition-shadow focus:border-primary focus:shadow-soft"
              />
            </form>
          ) : (
            <span className="flex-1 font-display text-lg font-bold">Book Review</span>
          )}

          <Mascot className="h-9 w-9" />
          <Link
            to="/profile"
            aria-label="Your profile"
            className="press grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground"
          >
            {initial}
          </Link>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col gap-4 bg-sidebar p-5 shadow-pop duration-300 animate-in slide-in-from-left">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                  {initial}
                </span>
                <div>
                  <p className="font-display font-bold">{profile.name || "Reader"}</p>
                  <p className="text-xs text-muted-foreground">{profile.email || "no email"}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-1.5 hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-card p-3 text-xs text-muted-foreground">
              <p>Age: {profile.age || "—"}</p>
              <p>Gender: {profile.gender || "—"}</p>
              <p>Favourites: {profile.categories.slice(0, 3).join(", ") || "—"}</p>
            </div>

            <div className="space-y-2">
              <p className="px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Settings
              </p>
              <label className="flex items-center gap-2 rounded-2xl bg-card p-3 text-sm">
                <Globe className="h-4 w-4 text-primary" />
                <select
                  aria-label="Change language"
                  value={profile.language}
                  onChange={(e) => saveProfile({ ...profile, language: e.target.value })}
                  className="w-full bg-transparent outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="press flex items-center gap-2 rounded-2xl bg-card p-3 text-sm font-semibold"
              >
                <UserCog className="h-4 w-4 text-primary" /> Edit profile
              </Link>
              <button
                onClick={() => {
                  clearProfile();
                  setOpen(false);
                  navigate({ to: "/onboarding" });
                }}
                className="press flex w-full items-center gap-2 rounded-2xl bg-card p-3 text-sm font-semibold text-destructive"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default AppHeader;
