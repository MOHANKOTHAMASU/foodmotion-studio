"use client";

import * as React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { collectImageSources, preloadImages, renderFrame, type ImageCache } from "@/lib/animation/renderer";
import { totalDuration } from "@/lib/animation/document";
import type { AnimationDocument } from "@/lib/animation/types";
import { cn, formatDuration } from "@/lib/utils";

export type PlayerHandle = {
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (ms: number) => void;
  getCanvas: () => HTMLCanvasElement | null;
};

type Props = {
  document: AnimationDocument;
  width: number;
  height: number;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  watermark?: string | null;
  className?: string;
  /** external controlled time (editor scrubbing). When provided, playback is driven by the parent. */
  timeMs?: number;
  onTimeChange?: (ms: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  poster?: boolean;
  label?: string;
};

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export const AnimationPlayer = React.forwardRef<PlayerHandle, Props>(function AnimationPlayer(
  { document: doc, width, height, autoPlay = false, loop = true, controls = true, watermark, className, timeMs, onTimeChange, onPlayingChange, poster, label },
  ref,
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imagesRef = React.useRef<ImageCache>(new Map());
  const [playing, setPlaying] = React.useState(false);
  const [internalTime, setInternalTime] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const reduced = usePrefersReducedMotion();
  const duration = totalDuration(doc);
  const controlled = timeMs !== undefined;
  const current = controlled ? timeMs! : internalTime;

  const lastFrameRef = React.useRef<number>(0);
  const timeRef = React.useRef(0);
  timeRef.current = current;

  // preload images whenever document changes
  React.useEffect(() => {
    let cancelled = false;
    setReady(false);
    preloadImages(collectImageSources(doc), imagesRef.current).then(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, [doc]);

  const draw = React.useCallback(
    (ms: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      renderFrame(ctx, doc, ms, { width, height, images: imagesRef.current, watermark: watermark ?? null });
    },
    [doc, width, height, watermark],
  );

  // redraw on time or doc changes when not playing
  React.useEffect(() => {
    if (!playing) draw(current);
  }, [current, draw, playing, ready]);

  // rAF loop
  React.useEffect(() => {
    if (!playing) return;
    let raf = 0;
    lastFrameRef.current = performance.now();
    const tick = (now: number) => {
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      let next = timeRef.current + delta;
      if (next >= duration) {
        if (loop) next = next % Math.max(duration, 1);
        else {
          next = duration;
          setPlaying(false);
          onPlayingChange?.(false);
        }
      }
      timeRef.current = next;
      if (controlled) onTimeChange?.(next);
      else setInternalTime(next);
      draw(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, loop, draw, controlled, onTimeChange, onPlayingChange]);

  const setTime = React.useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(ms, duration));
      timeRef.current = clamped;
      if (controlled) onTimeChange?.(clamped);
      else setInternalTime(clamped);
      draw(clamped);
    },
    [controlled, draw, duration, onTimeChange],
  );

  const play = React.useCallback(() => {
    if (timeRef.current >= duration) setTime(0);
    setPlaying(true);
    onPlayingChange?.(true);
  }, [duration, onPlayingChange, setTime]);
  const pause = React.useCallback(() => {
    setPlaying(false);
    onPlayingChange?.(false);
  }, [onPlayingChange]);
  const restart = React.useCallback(() => {
    setTime(0);
    setPlaying(true);
    onPlayingChange?.(true);
  }, [onPlayingChange, setTime]);

  React.useImperativeHandle(ref, () => ({ play, pause, restart, seek: setTime, getCanvas: () => canvasRef.current }), [play, pause, restart, setTime]);

  // autoplay unless reduced motion / poster
  React.useEffect(() => {
    if (autoPlay && !reduced && !poster && ready) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reduced, poster, ready]);

  // pause when scrolled out of view
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el || !autoPlay) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pause();
        else if (!reduced && !poster) play();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay, pause, play, reduced, poster]);

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl bg-espresso-950", className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        role="img"
        aria-label={label ?? "Food animation preview"}
        className="block h-auto w-full"
        style={{ aspectRatio: `${width} / ${height}` }}
        onClick={() => (playing ? pause() : play())}
      />
      {!ready && <div className="skeleton absolute inset-0 opacity-30" aria-hidden />}
      {reduced && !playing && (
        <p className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white">
          Reduced motion: press play to animate
        </p>
      )}
      {controls && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-white">
          <button
            type="button"
            onClick={() => (playing ? pause() : play())}
            aria-label={playing ? "Pause" : "Play"}
            className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={restart} aria-label="Restart" className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25">
            <RotateCcw className="h-4 w-4" />
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            step={16}
            value={Math.round(current)}
            onChange={(e) => {
              pause();
              setTime(Number(e.target.value));
            }}
            aria-label="Timeline"
            aria-valuetext={formatDuration(current)}
            className="h-1.5 flex-1 cursor-pointer accent-saffron-500"
            style={{ background: `linear-gradient(90deg, #e8882e ${pct}%, rgba(255,255,255,0.25) ${pct}%)` }}
          />
          <span className="tabular-nums text-[11px] font-medium">
            {formatDuration(current)} / {formatDuration(duration)}
          </span>
        </div>
      )}
    </div>
  );
});
