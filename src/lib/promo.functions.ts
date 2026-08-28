import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildPromoPrompt,
  createPromoVideo,
  pollPromoVideo,
  PromoGatewayError,
} from "./promo.server";

export type PromoStatus = {
  id: string;
  status: "in_progress" | "completed" | "failed";
  progress?: number;
  error?: string;
  url?: string;
};

export const startBookPromo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        title: z.string().min(1),
        authors: z.array(z.string()).default([]),
        categories: z.array(z.string()).default([]),
        description: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<PromoStatus> => {
    try {
      const job = await createPromoVideo(buildPromoPrompt(data));
      return { id: job.id, status: job.status };
    } catch (error) {
      if (error instanceof PromoGatewayError) {
        return { id: "", status: "failed", error: error.message };
      }
      throw error;
    }
  });

export const getBookPromo = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<PromoStatus> => {
    try {
      const job = await pollPromoVideo(data.id);
      return {
        ...job,
        ...(job.status === "completed" ? { url: `/api/promo-video/${job.id}` } : {}),
      };
    } catch (error) {
      if (error instanceof PromoGatewayError) {
        return { id: data.id, status: "failed", error: error.message };
      }
      throw error;
    }
  });
