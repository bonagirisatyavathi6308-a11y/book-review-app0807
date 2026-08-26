import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Book = {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  thumbnail?: string;
  publishedDate?: string;
  description?: string;
  categories: string[];
  pageCount?: number;
  averageRating?: number;
  publisher?: string;
  previewLink?: string;
};

type RawVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    categories?: string[];
    pageCount?: number;
    averageRating?: number;
    publisher?: string;
    previewLink?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

function normalize(v: RawVolume): Book {
  const info = v.volumeInfo ?? {};
  const raw = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;
  return {
    id: v.id,
    title: info.title ?? "Untitled",
    subtitle: info.subtitle,
    authors: info.authors ?? [],
    thumbnail: raw ? raw.replace(/^http:/, "https:") : undefined,
    publishedDate: info.publishedDate,
    description: info.description,
    categories: info.categories ?? [],
    pageCount: info.pageCount,
    averageRating: info.averageRating,
    publisher: info.publisher,
    previewLink: info.previewLink,
  };
}

async function callBooksApi(path: string, params: Record<string, string>) {
  const key = process.env["GOOGLE_API_KEY"];
  const url = new URL(`https://www.googleapis.com/books/v1/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (key) url.searchParams.set("key", key);
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Books request failed (${res.status})`);
  }
  return (await res.json()) as { items?: RawVolume[] };
}

export const searchBooks = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        query: z.string().min(1),
        maxResults: z.number().min(1).max(40).optional(),
        orderBy: z.enum(["relevance", "newest"]).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<Book[]> => {
    const json = await callBooksApi("volumes", {
      q: data.query,
      maxResults: String(data.maxResults ?? 20),
      orderBy: data.orderBy ?? "relevance",
      printType: "books",
    });
    return (json.items ?? []).map(normalize);
  });

export const getBook = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<Book> => {
    const key = process.env["GOOGLE_API_KEY"];
    const url = new URL(`https://www.googleapis.com/books/v1/volumes/${data.id}`);
    if (key) url.searchParams.set("key", key);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Book not found (${res.status})`);
    return normalize((await res.json()) as RawVolume);
  });
