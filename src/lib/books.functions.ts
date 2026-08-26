import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchGoogleBook, searchGoogleBooks } from "./books.server";

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
    return searchGoogleBooks(
      data.query,
      data.maxResults ?? 20,
      data.orderBy ?? "relevance",
      process.env["GOOGLE_API_KEY"],
    );
  });

export const getBook = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<Book> => {
    return fetchGoogleBook(data.id, process.env["GOOGLE_API_KEY"]);
  });
