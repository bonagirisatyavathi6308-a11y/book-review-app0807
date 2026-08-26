import type { Book } from "./books.functions";

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

function normalize(volume: RawVolume): Book {
  const info = volume.volumeInfo ?? {};
  const rawThumbnail = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return {
    id: volume.id,
    title: info.title ?? "Untitled",
    authors: info.authors ?? [],
    categories: info.categories ?? [],
    ...(info.subtitle ? { subtitle: info.subtitle } : {}),
    ...(rawThumbnail ? { thumbnail: rawThumbnail.replace(/^http:/, "https:") } : {}),
    ...(info.publishedDate ? { publishedDate: info.publishedDate } : {}),
    ...(info.description ? { description: info.description } : {}),
    ...(info.pageCount !== undefined ? { pageCount: info.pageCount } : {}),
    ...(info.averageRating !== undefined ? { averageRating: info.averageRating } : {}),
    ...(info.publisher ? { publisher: info.publisher } : {}),
    ...(info.previewLink ? { previewLink: info.previewLink } : {}),
  };
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

async function fetchGoogleBooks(url: URL): Promise<Response> {
  let lastStatus = 503;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8_000),
      });

      if (response.ok || !RETRYABLE_STATUSES.has(response.status)) return response;
      lastStatus = response.status;
    } catch (error) {
      if (attempt === 2) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
  }

  return new Response(null, { status: lastStatus });
}

export async function searchGoogleBooks(
  query: string,
  maxResults: number,
  orderBy: "relevance" | "newest",
  apiKey?: string,
): Promise<Book[]> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("orderBy", orderBy);
  url.searchParams.set("printType", "books");
  if (apiKey) url.searchParams.set("key", apiKey);

  try {
    const response = await fetchGoogleBooks(url);
    if (!response.ok) {
      console.error(`Google Books search unavailable (${response.status})`);
      return [];
    }

    const json = (await response.json()) as { items?: RawVolume[] };
    return (json.items ?? []).map(normalize);
  } catch (error) {
    console.error("Google Books search unavailable", error);
    return [];
  }
}

export async function fetchGoogleBook(id: string, apiKey?: string): Promise<Book> {
  const url = new URL(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`);
  if (apiKey) url.searchParams.set("key", apiKey);

  const response = await fetchGoogleBooks(url);
  if (!response.ok) throw new Error(`Book not found (${response.status})`);
  return normalize((await response.json()) as RawVolume);
}