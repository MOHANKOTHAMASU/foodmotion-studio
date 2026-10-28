import { drawSprite } from "./sprites";
import { resolveLayerTransform } from "./interpolate";
import { locateScene } from "./document";
import { clamp01, easings } from "./easing";
import type { AnimationDocument, Background, EffectLayer, Layer, Scene, TextLayer } from "./types";

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Drawable = CanvasImageSource;

export type ImageCache = Map<string, Drawable | "loading" | "error">;

export type RenderOptions = {
  width: number;
  height: number;
  images: ImageCache;
  /** When true, the renderer draws nothing animated (used for reduced-motion poster frames). */
  staticFrame?: boolean;
  watermark?: string | null;
  fonts?: { display: string; sans: string };
};

const DEFAULT_FONTS = { display: '"Fraunces", Georgia, serif', sans: '"Manrope", system-ui, sans-serif' };

export function drawBackground(ctx: Ctx, bg: Background, w: number, h: number, images: ImageCache) {
  if (bg.kind === "solid") {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, w, h);
  } else if (bg.kind === "gradient") {
    const rad = ((bg.angle - 90) * Math.PI) / 180;
    const len = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    const cx = w / 2;
    const cy = h / 2;
    const g = ctx.createLinearGradient(
      cx - (Math.cos(rad) * len) / 2,
      cy - (Math.sin(rad) * len) / 2,
      cx + (Math.cos(rad) * len) / 2,
      cy + (Math.sin(rad) * len) / 2,
    );
    g.addColorStop(0, bg.from);
    g.addColorStop(1, bg.to);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else {
    const img = images.get(bg.src);
    ctx.fillStyle = "#1f1814";
    ctx.fillRect(0, 0, w, h);
    if (img && img !== "loading" && img !== "error") {
      drawCover(ctx, img, w, h);
    }
    if (bg.overlay) {
      ctx.fillStyle = bg.overlay;
      ctx.fillRect(0, 0, w, h);
    }
  }
}

function drawCover(ctx: Ctx, img: Drawable, w: number, h: number) {
  const iw = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width || w;
  const ih = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height || h;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function drawText(ctx: Ctx, layer: TextLayer, fonts: { display: string; sans: string }) {
  const family = layer.fontFamily === "display" ? fonts.display : fonts.sans;
  ctx.font = `${layer.weight} ${layer.fontSize}px ${family}`;
  ctx.textAlign = layer.align;
  ctx.textBaseline = "middle";
  if (layer.shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = layer.fontSize * 0.35;
    ctx.shadowOffsetY = layer.fontSize * 0.08;
  }
  ctx.fillStyle = layer.color;
  const lines = layer.text.split("\n");
  const lh = layer.fontSize * 1.15;
  const startY = -((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lh));
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function drawEffect(ctx: Ctx, layer: EffectLayer, t: number, absoluteSeconds: number) {
  const { width: w, height: h, intensity } = layer;
  const color = layer.color ?? "#ffffff";
  switch (layer.effect) {
    case "steam": {
      const rnd = seeded(17);
      const count = Math.round(6 + intensity * 10);
      for (let i = 0; i < count; i++) {
        const phase = (absoluteSeconds * (0.25 + rnd() * 0.25) + rnd()) % 1;
        const x = (rnd() - 0.5) * w + Math.sin(phase * Math.PI * 2 + i) * w * 0.08;
        const y = h / 2 - phase * h;
        const r = (0.08 + phase * 0.25) * w * 0.5;
        const alpha = Math.sin(phase * Math.PI) * 0.35 * intensity;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, hexToRgba(color, alpha));
        g.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "sparkle": {
      const rnd = seeded(29);
      const count = Math.round(8 + intensity * 20);
      for (let i = 0; i < count; i++) {
        const x = (rnd() - 0.5) * w;
        const y = (rnd() - 0.5) * h;
        const tw = Math.pow(Math.max(0, Math.sin(absoluteSeconds * (2 + rnd() * 3) + rnd() * 6)), 3);
        const r = (2 + rnd() * 4) * tw * intensity;
        if (r < 0.2) continue;
        ctx.fillStyle = hexToRgba(color, 0.9);
        ctx.beginPath();
        ctx.moveTo(x, y - r * 2);
        ctx.lineTo(x + r * 0.5, y);
        ctx.lineTo(x, y + r * 2);
        ctx.lineTo(x - r * 0.5, y);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "confetti": {
      const rnd = seeded(41);
      const colors = ["#ff5c7a", "#ffd166", "#06d6a0", "#4cc9f0", "#f72585", "#ff9f1c"];
      const count = Math.round(20 + intensity * 40);
      for (let i = 0; i < count; i++) {
        const sx = (rnd() - 0.5) * w;
        const speed = 0.4 + rnd() * 0.6;
        const y = -h / 2 + ((t * speed + rnd()) % 1) * h;
        const x = sx + Math.sin(t * 8 + i) * 12;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 10 + i);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(-4, -2, 8, 4);
        ctx.restore();
      }
      break;
    }
    case "glow": {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) / 2);
      const pulse = 0.75 + 0.25 * Math.sin(absoluteSeconds * 2);
      g.addColorStop(0, hexToRgba(color, 0.55 * intensity * pulse));
      g.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      break;
    }
    case "vignette": {
      const g = ctx.createRadialGradient(0, 0, Math.min(w, h) * 0.3, 0, 0, Math.max(w, h) * 0.75);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,0,0,${0.7 * intensity})`);
      ctx.fillStyle = g;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      break;
    }
    case "light-sweep": {
      const pos = -w / 2 + easings.easeInOut(t) * w * 1.4 - w * 0.2;
      const g = ctx.createLinearGradient(pos - w * 0.2, 0, pos + w * 0.2, 0);
      g.addColorStop(0, hexToRgba(color, 0));
      g.addColorStop(0.5, hexToRgba(color, 0.35 * intensity));
      g.addColorStop(1, hexToRgba(color, 0));
      ctx.save();
      ctx.rotate(-0.35);
      ctx.fillStyle = g;
      ctx.fillRect(-w, -h, w * 2, h * 2);
      ctx.restore();
      break;
    }
  }
}

export function hexToRgba(hex: string, alpha: number) {
  if (hex.startsWith("rgb")) {
    return hex.replace(/rgba?\(([^)]+)\)/, (_m, inner: string) => {
      const [r, g, b] = inner.split(",").map((v) => v.trim());
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    });
  }
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function drawLayer(ctx: Ctx, layer: Layer, t: number, absoluteSeconds: number, opts: RenderOptions) {
  if (!layer.visible) return;
  const tr = resolveLayerTransform(layer, t);
  if (tr.opacity <= 0.001) return;
  ctx.save();
  ctx.globalAlpha = tr.opacity;
  ctx.translate(tr.x, tr.y);
  ctx.rotate((tr.rotation * Math.PI) / 180);
  ctx.scale(tr.scale, tr.scale);
  switch (layer.type) {
    case "food":
      drawSprite(ctx, layer.sprite, layer.size, layer.tint, absoluteSeconds);
      break;
    case "text":
      drawText(ctx, layer, opts.fonts ?? DEFAULT_FONTS);
      break;
    case "shape": {
      ctx.fillStyle = layer.fill;
      ctx.beginPath();
      if (layer.shape === "circle") ctx.ellipse(0, 0, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
      else ctx.roundRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height, layer.shape === "pill" ? layer.height / 2 : 16);
      ctx.fill();
      if (layer.stroke) {
        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      break;
    }
    case "image": {
      const img = opts.images.get(layer.src);
      const r = layer.radius ?? 0;
      ctx.beginPath();
      ctx.roundRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height, r);
      if (img && img !== "loading" && img !== "error") {
        ctx.save();
        ctx.clip();
        drawCoverCentered(ctx, img, layer.width, layer.height);
        ctx.restore();
      } else {
        ctx.fillStyle = img === "error" ? "rgba(198,54,47,0.25)" : "rgba(255,255,255,0.12)";
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = `600 14px ${(opts.fonts ?? DEFAULT_FONTS).sans}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(img === "error" ? "Image failed to load" : "Loading image…", 0, 0);
      }
      break;
    }
    case "effect":
      drawEffect(ctx, layer, t, absoluteSeconds);
      break;
  }
  ctx.restore();
}

function drawCoverCentered(ctx: Ctx, img: Drawable, w: number, h: number) {
  const iw = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width || w;
  const ih = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height || h;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
}

export function drawScene(ctx: Ctx, scene: Scene, t: number, absoluteSeconds: number, opts: RenderOptions) {
  drawBackground(ctx, scene.background, opts.width, opts.height, opts.images);
  for (const layer of scene.layers) drawLayer(ctx, layer, t, absoluteSeconds, opts);
}

/**
 * Render the whole document at absolute time `timeMs`. Handles cross-scene
 * transitions by compositing the previous scene's final frame during the
 * incoming scene's transition window.
 */
export function renderFrame(ctx: Ctx, doc: AnimationDocument, timeMs: number, opts: RenderOptions) {
  const { width: w, height: h } = opts;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  const located = locateScene(doc, timeMs);
  if (!located) {
    ctx.fillStyle = "#1f1814";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    return;
  }
  const { scene, index, localMs, t } = located;
  const seconds = timeMs / 1000;
  const prev = index > 0 ? doc.scenes[index - 1] : null;
  const inTransition = prev && scene.transition !== "cut" && localMs < scene.transitionMs;

  if (inTransition && prev) {
    const p = clamp01(localMs / scene.transitionMs);
    const e = easings.easeInOut(p);
    // outgoing scene (its last frame)
    drawScene(ctx, prev, 1, seconds, opts);
    ctx.save();
    switch (scene.transition) {
      case "fade":
        ctx.globalAlpha = e;
        break;
      case "slide-left":
        ctx.translate((1 - e) * w, 0);
        break;
      case "slide-up":
        ctx.translate(0, (1 - e) * h);
        break;
      case "zoom":
        ctx.globalAlpha = e;
        ctx.translate(w / 2, h / 2);
        ctx.scale(0.85 + 0.15 * e, 0.85 + 0.15 * e);
        ctx.translate(-w / 2, -h / 2);
        break;
    }
    drawScene(ctx, scene, t, seconds, opts);
    ctx.restore();
  } else {
    drawScene(ctx, scene, t, seconds, opts);
  }

  if (opts.watermark) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${Math.round(Math.min(w, h) * 0.028)}px ${(opts.fonts ?? DEFAULT_FONTS).sans}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    ctx.fillText(opts.watermark, w - Math.round(w * 0.02), h - Math.round(h * 0.025));
    ctx.restore();
  }
  ctx.restore();
}

/** Collect every image URL referenced by the document (layers + backgrounds). */
export function collectImageSources(doc: AnimationDocument): string[] {
  const set = new Set<string>();
  for (const s of doc.scenes) {
    if (s.background.kind === "image") set.add(s.background.src);
    for (const l of s.layers) if (l.type === "image") set.add(l.src);
  }
  return [...set];
}

/** Browser-only image loader with cache; resolves when all images settled (loaded or errored). */
export async function preloadImages(sources: string[], cache: ImageCache): Promise<void> {
  if (typeof window === "undefined") return;
  await Promise.all(
    sources
      .filter((src) => !cache.has(src) || cache.get(src) === "error")
      .map(
        (src) =>
          new Promise<void>((resolve) => {
            cache.set(src, "loading");
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              cache.set(src, img);
              resolve();
            };
            img.onerror = () => {
              cache.set(src, "error");
              resolve();
            };
            img.src = src;
          }),
      ),
  );
}
