import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_SECONDS = 60;

type Props = {
  onChange: (value: { url: string; seconds: number } | null) => void;
};

/**
 * 60-second voice-review recorder.
 * Uses MediaRecorder for capture and the Web Audio API (AnalyserNode) for the
 * live waveform while recording and for playback level metering.
 */
export default function AudioRecorder({ onChange }: Props) {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [clip, setClip] = useState<{ url: string; seconds: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "hsl(262 45% 78%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }, []);

  const drawWave = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!analyser || !canvas || !ctx) return;

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buffer);

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "hsl(262 60% 62%)");
    gradient.addColorStop(1, "hsl(48 90% 62%)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const step = width / buffer.length;
    for (let i = 0; i < buffer.length; i++) {
      const v = (buffer[i] ?? 128) / 128;
      const y = (v * height) / 2;
      const x = i * step;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    rafRef.current = requestAnimationFrame(drawWave);
  }, []);

  const teardownAudioGraph = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      void audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    teardownAudioGraph();
    setRecording(false);
    drawIdle();
  }, [drawIdle, teardownAudioGraph]);

  useEffect(() => {
    drawIdle();
    return () => {
      stopRecording();
      if (clip) URL.revokeObjectURL(clip.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Web Audio API graph: mic source -> analyser (visualisation only).
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === "suspended") await audioCtx.resume().catch(() => {});
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      rafRef.current = requestAnimationFrame(drawWave);

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        const length = Math.min(
          MAX_SECONDS,
          Math.round((Date.now() - startedAtRef.current) / 1000),
        );
        setClip((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url, seconds: length };
        });
        onChange({ url, seconds: length });
      };
      recorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setSeconds(0);
      setRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_SECONDS) stopRecording();
          return Math.min(next, MAX_SECONDS);
        });
      }, 1000);
    } catch {
      toast.error("Microphone access was blocked.");
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      void el.play();
    }
  };

  const discard = () => {
    if (clip) URL.revokeObjectURL(clip.url);
    setClip(null);
    setSeconds(0);
    onChange(null);
    drawIdle();
  };

  const remaining = MAX_SECONDS - seconds;

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="font-medium">Voice review</p>
        <span
          className={`rounded-full px-3 py-1 font-mono text-sm ${
            recording ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          {recording
            ? `00:${String(remaining).padStart(2, "0")} left`
            : clip
              ? `00:${String(clip.seconds).padStart(2, "0")}`
              : "00:60 max"}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={96}
        className="mt-3 h-24 w-full rounded-xl bg-muted/40"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {recording ? (
          <Button type="button" variant="destructive" onClick={stopRecording} className="press">
            <Square className="mr-2 size-4" /> Stop
          </Button>
        ) : (
          <Button type="button" onClick={startRecording} className="press">
            <Mic className="mr-2 size-4" /> {clip ? "Record again" : "Record"}
          </Button>
        )}

        {clip && !recording && (
          <>
            <Button type="button" variant="secondary" onClick={togglePlay} className="press">
              {playing ? <Pause className="mr-2 size-4" /> : <Play className="mr-2 size-4" />}
              {playing ? "Pause" : "Play"}
            </Button>
            <Button type="button" variant="ghost" onClick={discard} className="press">
              <Trash2 className="mr-2 size-4" /> Discard
            </Button>
          </>
        )}
      </div>

      {clip && (
        <audio
          ref={audioRef}
          src={clip.url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}
