import { useCallback, useEffect, useState } from "react";

export type Profile = {
  name: string;
  age: string;
  gender: string;
  email: string;
  categories: string[];
  authors: string[];
  language: string;
  onboarded: boolean;
};

export type HistoryItem = {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  viewedAt: number;
};

export type Review = {
  id: string;
  bookId: string;
  bookTitle: string;
  thumbnail?: string;
  type: "text" | "audio";
  understandability: number;
  interest: number;
  suggestibility: number;
  audience: "Kids" | "Youth" | "Adults";
  comment: string;
  audioUrl?: string;
  audioSeconds?: number;
  createdAt: number;
};

const KEYS = {
  profile: "br.profile",
  history: "br.history",
  reviews: "br.reviews",
} as const;

export const CATEGORIES = [
  "Fiction",
  "Mystery",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Self Help",
  "Poetry",
  "Business",
  "Children",
];

export const AUTHORS = [
  "Agatha Christie",
  "J.K. Rowling",
  "Haruki Murakami",
  "Chetan Bhagat",
  "Stephen King",
  "Jane Austen",
  "Paulo Coelho",
  "Colleen Hoover",
  "R.K. Narayan",
  "George Orwell",
];

export const LANGUAGES = [
  "English",
  "हिन्दी (Hindi)",
  "తెలుగు (Telugu)",
  "தமிழ் (Tamil)",
  "Español",
  "Français",
  "Deutsch",
  "日本語",
];

export const emptyProfile: Profile = {
  name: "",
  age: "",
  gender: "",
  email: "",
  categories: [],
  authors: [],
  language: "English",
  onboarded: false,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("br:store", { detail: key }));
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setReady(true);
    const sync = () => setValue(read<T>(key, fallback));
    window.addEventListener("br:store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("br:store", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    (next: T) => {
      write(key, next);
      setValue(next);
    },
    [key],
  );

  return { value, save, ready };
}

export function useProfile() {
  const { value, save, ready } = useStored<Profile>(KEYS.profile, emptyProfile);
  const clear = useCallback(() => save(emptyProfile), [save]);
  return { profile: value, saveProfile: save, ready, clearProfile: clear };
}

export function useHistory() {
  const { value, save, ready } = useStored<HistoryItem[]>(KEYS.history, []);
  const clear = useCallback(() => save([]), [save]);
  return { history: value, saveHistory: save, ready, clearHistory: clear };
}

export function useReviews() {
  const { value, save, ready } = useStored<Review[]>(KEYS.reviews, []);
  const add = useCallback(
    (review: Review) => save([review, ...read<Review[]>(KEYS.reviews, [])]),
    [save],
  );
  const remove = useCallback(
    (id: string) => save(read<Review[]>(KEYS.reviews, []).filter((r) => r.id !== id)),
    [save],
  );
  return { reviews: value, addReview: add, removeReview: remove, ready };
}

export function trackVisit(item: Omit<HistoryItem, "viewedAt">) {
  if (typeof window === "undefined") return;
  const list = read<HistoryItem[]>(KEYS.history, []).filter((h) => h.id !== item.id);
  write(KEYS.history, [{ ...item, viewedAt: Date.now() }, ...list].slice(0, 40));
}

export function isOnboarded() {
  return read<Profile>(KEYS.profile, emptyProfile).onboarded;
}
