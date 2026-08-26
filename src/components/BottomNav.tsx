import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, PenLine, Clapperboard, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/upload-review", label: "Review", icon: PenLine },
  { to: "/promo", label: "Promo", icon: Clapperboard },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2 py-1.5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className="press flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5"
              >
                <span
                  className={cn(
                    "flex h-9 w-14 items-center justify-center rounded-full transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomNav;
