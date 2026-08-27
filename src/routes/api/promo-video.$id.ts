import { createFileRoute } from "@tanstack/react-router";
import { fetchPromoVideoContent } from "@/lib/promo.server";

export const Route = createFileRoute("/api/promo-video/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const upstream = await fetchPromoVideoContent(params.id);
        if (!upstream.ok || !upstream.body) {
          return new Response("Video unavailable", { status: 404 });
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": "video/mp4",
            "cache-control": "private, max-age=3600",
          },
        });
      },
    },
  },
});
