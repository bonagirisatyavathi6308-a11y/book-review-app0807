import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Book } from "@/lib/books.functions";

const DURATION = 18_000; // ms

type Scene = { start: number; end: number };

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** fade in at the start of a scene, fade out at the end */
function sceneAlpha(now: number, { start, end }: Scene, fade = 700) {
  if (now < start || now > end) return 0;
  return Math.min(clamp01((now - start) / fade), clamp01((end - now) / fade));
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) return lines;
    } else {
      line = candidate;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

export default function BookTeaser({ book }: { book: Book }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coverRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // load cover
  useEffect(() => {
    coverRef.current = null;
    if (!book.thumbnail) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      coverRef.current = img;
    };
    img.src = book.thumbnail;
  }, [book.thumbnail]);

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const styles = getComputedStyle(canvas);
      const color = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;
      const primary = color("--primary", "#a78bfa");
      const accent = color("--accent", "#fde68a");
      const ink = color("--foreground", "#2b2440");
      const card = color("--card", "#ffffff");

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // ---- background gradient + drifting blobs
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, primary);
      bg.addColorStop(1, accent);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const t = now / 1000;
      ctx.save();
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 5; i += 1) {
        const r = (h / 3) * (0.5 + (i % 3) * 0.25);
        const x = w * (0.15 + 0.18 * i) + Math.sin(t * (0.25 + i * 0.08) + i) * w * 0.09;
        const y = h * (0.3 + 0.12 * ((i * 3) % 4)) + Math.cos(t * (0.2 + i * 0.06) + i) * h * 0.12;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, i % 2 === 0 ? card : accent);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ---- scene 1: cover with gentle zoom (whole timeline, drifts)
      const img = coverRef.current;
      const coverScene: Scene = { start: 200, end: DURATION };
      const coverA = sceneAlpha(now, coverScene, 900);
      const coverW = Math.min(w * 0.3, h * 0.42);
      const coverH = coverW * 1.5;
      const zoom = 1 + 0.08 * Math.sin(t * 0.5);
      const cx = w * 0.24;
      const cy = h * 0.5 + Math.sin(t * 0.6) * 6;

      ctx.save();
      ctx.globalAlpha = coverA;
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = card;
      const rx = -coverW / 2;
      const ry = -coverH / 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, coverW, coverH, 10);
      ctx.fill();
      ctx.shadowColor = "transparent";
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(rx, ry, coverW, coverH, 10);
        ctx.clip();
        ctx.drawImage(img, rx, ry, coverW, coverH);
        ctx.restore();
      } else {
        ctx.fillStyle = ink;
        ctx.font = `600 ${Math.round(coverW * 0.11)}px ui-sans-serif, system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        wrapText(ctx, book.title, coverW * 0.8, 4).forEach((line, i, arr) => {
          ctx.fillText(line, 0, (i - (arr.length - 1) / 2) * coverW * 0.15);
        });
      }
      ctx.restore();

      // ---- right column text scenes
      const tx = w * 0.46;
      const maxW = w * 0.48;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const title: Scene = { start: 600, end: 7000 };
      const author: Scene = { start: 2600, end: 7000 };
      const synopsis: Scene = { start: 7200, end: 14500 };
      const outro: Scene = { start: 14700, end: DURATION };

      const titleA = sceneAlpha(now, title);
      if (titleA > 0) {
        const rise = (1 - easeOutCubic(clamp01((now - title.start) / 700))) * 18;
        ctx.save();
        ctx.globalAlpha = titleA;
        ctx.fillStyle = ink;
        const size = Math.max(18, Math.round(w * 0.045));
        ctx.font = `800 ${size}px ui-sans-serif, system-ui`;
        wrapText(ctx, book.title, maxW, 3).forEach((line, i) => {
          ctx.fillText(line, tx, h * 0.38 + rise + i * size * 1.2);
        });
        ctx.restore();
      }

      const authorA = sceneAlpha(now, author);
      if (authorA > 0 && book.authors.length) {
        const rise = (1 - easeOutCubic(clamp01((now - author.start) / 700))) * 14;
        ctx.save();
        ctx.globalAlpha = authorA;
        ctx.fillStyle = ink;
        ctx.font = `500 ${Math.max(13, Math.round(w * 0.026))}px ui-sans-serif, system-ui`;
        ctx.fillText(`by ${book.authors.join(", ")}`, tx, h * 0.7 + rise);
        ctx.restore();
      }

      const synA = sceneAlpha(now, synopsis);
      if (synA > 0) {
        const text = book.description
          ? stripHtml(book.description)
          : `${book.title} — discover it on Book Review.`;
        ctx.save();
        ctx.fillStyle = ink;
        const size = Math.max(12, Math.round(w * 0.024));
        ctx.font = `400 ${size}px ui-sans-serif, system-ui`;
        const lines = wrapText(ctx, text, maxW, 6);
        lines.forEach((line, i) => {
          const lineStart = synopsis.start + i * 380;
          const a = Math.min(synA, clamp01((now - lineStart) / 500));
          if (a <= 0) return;
          ctx.globalAlpha = a;
          const rise = (1 - easeOutCubic(clamp01((now - lineStart) / 600))) * 12;
          ctx.fillText(line, tx, h * 0.3 + rise + i * size * 1.6);
        });
        ctx.restore();
      }

      const outroA = sceneAlpha(now, outro, 800);
      if (outroA > 0) {
        ctx.save();
        ctx.globalAlpha = outroA;
        ctx.fillStyle = ink;
        ctx.textAlign = "left";
        ctx.font = `800 ${Math.max(16, Math.round(w * 0.038))}px ui-sans-serif, system-ui`;
        ctx.fillText("Read it. Review it.", tx, h * 0.48);
        ctx.font = `500 ${Math.max(12, Math.round(w * 0.024))}px ui-sans-serif, system-ui`;
        ctx.fillText("Book Review", tx, h * 0.6);
        ctx.restore();
      }
    },
    [book],
  );

  // animation loop
  useEffect(() => {
    const tick = (ts: number) => {
      if (playingRef.current) {
        const last = lastTickRef.current ?? ts;
        lastTickRef.current = ts;
        elapsedRef.current += ts - last;
        if (elapsedRef.current >= DURATION) {
          elapsedRef.current = DURATION;
          playingRef.current = false;
          setPlaying(false);
        }
        setProgress(elapsedRef.current / DURATION);
      } else {
        lastTickRef.current = ts;
      }
      draw(elapsedRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // reset when the book changes
  useEffect(() => {
    elapsedRef.current = 0;
    playingRef.current = false;
    setPlaying(false);
    setProgress(0);
  }, [book.id]);

  const toggle = () => {
    if (elapsedRef.current >= DURATION) elapsedRef.current = 0;
    lastTickRef.current = null;
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };

  const restart = () => {
    elapsedRef.current = 0;
    lastTickRef.current = null;
    playingRef.current = true;
    setPlaying(true);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    elapsedRef.current = clamp01((e.clientX - rect.left) / rect.width) * DURATION;
    setProgress(elapsedRef.current / DURATION);
  };

  const seconds = Math.ceil((DURATION - progress * DURATION) / 1000);

  return (
    <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
      <h2 className="font-display text-lg font-bold">Animated teaser</h2>
      <div className="mt-3 overflow-hidden rounded-2xl bg-secondary">
        <canvas
          ref={canvasRef}
          onClick={toggle}
          aria-label={`Animated teaser for ${book.title}`}
          className="aspect-video w-full cursor-pointer"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause teaser" : "Play teaser"}
          className="press flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={restart}
          aria-label="Restart teaser"
          className="press flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <div
          onClick={seek}
          role="presentation"
          className="h-2 flex-1 cursor-pointer rounded-full bg-secondary"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
          0:{String(Math.max(seconds, 0)).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
