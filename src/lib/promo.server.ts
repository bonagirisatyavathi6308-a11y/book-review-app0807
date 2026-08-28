const GATEWAY = "https://ai.gateway.lovable.dev/v1/videos";

export type PromoJob = {
  id: string;
  status: "in_progress" | "completed" | "failed";
  progress?: number;
  error?: string;
};

export class PromoGatewayError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PromoGatewayError";
    this.status = status;
  }
}

function authHeaders() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Video generation is not configured.");
  return { Authorization: `Bearer ${key}` };
}

export function buildPromoPrompt(input: {
  title: string;
  authors: string[];
  description?: string | undefined;
  categories: string[];
}): string {
  const author = input.authors[0] ? ` by ${input.authors[0]}` : "";
  const genre = input.categories[0] ? ` in the style of ${input.categories[0]}` : "";
  const gist = input.description ? ` Themes: ${input.description.slice(0, 300)}.` : "";
  return `A cinematic book promo teaser for the book "${input.title}"${author}${genre}. Warm pastel purple and pale yellow lighting, slow dolly across a cosy reading nook with the book at the centre, soft dust motes in the light, gentle page turns.${gist} A calm narrator says: Discover ${input.title}.`;
}

export async function createPromoVideo(prompt: string): Promise<PromoJob> {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/veo-3.1-lite",
      instances: [{ prompt }],
      parameters: {
        durationSeconds: 6,
        resolution: "720p",
        aspectRatio: "16:9",
        sampleCount: 1,
        generateAudio: true,
      },
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new PromoGatewayError(
      res.status,
      err?.message ?? `Video generation failed (${res.status})`,
    );
  }

  const job = (await res.json()) as PromoJob;
  return { id: job.id, status: job.status, ...(job.progress ? { progress: job.progress } : {}) };
}

export async function pollPromoVideo(id: string): Promise<PromoJob> {
  const res = await fetch(`${GATEWAY}/${encodeURIComponent(id)}`, { headers: authHeaders() });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new PromoGatewayError(
      res.status,
      err?.message ?? `Could not check video status (${res.status})`,
    );
  }
  const job = (await res.json()) as PromoJob & { error?: { message?: string } };
  return {
    id,
    status: job.status,
    ...(job.progress !== undefined ? { progress: job.progress } : {}),
    ...(job.error?.message ? { error: job.error.message } : {}),
  };
}

export async function fetchPromoVideoContent(id: string): Promise<Response> {
  return fetch(`${GATEWAY}/${encodeURIComponent(id)}/content`, { headers: authHeaders() });
}
