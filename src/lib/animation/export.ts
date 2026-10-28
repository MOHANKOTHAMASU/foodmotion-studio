import { GIFEncoder, quantize, applyPalette } from "gifenc";
import JSZip from "jszip";
import { collectImageSources, preloadImages, renderFrame, type ImageCache } from "./renderer";
import { totalDuration } from "./document";
import { LIMITS, type AnimationDocument, type ExportFormat } from "./types";

export type ExportProgress = { phase: "preparing" | "rendering" | "encoding" | "done"; frame: number; total: number };

export type ExportRequest = {
  document: AnimationDocument;
  width: number;
  height: number;
  fps: number;
  format: ExportFormat;
  watermark?: string | null;
  signal?: AbortSignal;
  onProgress?: (p: ExportProgress) => void;
};

export type ExportResult = { blob: Blob; fileName: string; mimeType: string; frameCount: number };

export const EXPORT_CAPABILITIES: Record<ExportFormat, { label: string; description: string; browser: boolean }> = {
  gif: { label: "GIF", description: "Animated GIF rendered in your browser. Best for WhatsApp, Instagram DMs and menus.", browser: true },
  png_sequence: { label: "PNG sequence (ZIP)", description: "Every frame as PNG inside a ZIP — drop into any video editor.", browser: true },
  webm: { label: "WebM video", description: "Real-time capture via MediaRecorder. Supported in Chrome, Edge and Firefox.", browser: true },
  png: { label: "Poster image (PNG)", description: "A single high-resolution still of the current frame.", browser: true },
};

export function canRecordWebm() {
  return typeof MediaRecorder !== "undefined" && typeof HTMLCanvasElement !== "undefined" && "captureStream" in HTMLCanvasElement.prototype && MediaRecorder.isTypeSupported("video/webm");
}

export function estimateFrameCount(doc: AnimationDocument, fps: number) {
  return Math.min(LIMITS.maxExportFrames, Math.ceil((totalDuration(doc) / 1000) * fps));
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");
  return { canvas, ctx };
}

function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Export cancelled", "AbortError");
}

const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

export async function exportDocument(req: ExportRequest): Promise<ExportResult> {
  const { document: doc, width, height, fps, format, watermark, signal, onProgress } = req;
  const images: ImageCache = new Map();
  onProgress?.({ phase: "preparing", frame: 0, total: 0 });
  await preloadImages(collectImageSources(doc), images);
  const durationMs = totalDuration(doc);
  const total = estimateFrameCount(doc, fps);
  const { canvas, ctx } = makeCanvas(width, height);
  const opts = { width, height, images, watermark: watermark ?? null };
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  if (format === "png") {
    renderFrame(ctx, doc, 0, opts);
    const blob = await canvasToBlob(canvas, "image/png");
    onProgress?.({ phase: "done", frame: 1, total: 1 });
    return { blob, fileName: `foodmotion-${stamp}.png`, mimeType: "image/png", frameCount: 1 };
  }

  if (format === "webm") {
    if (!canRecordWebm()) throw new Error("WebM recording is not supported in this browser. Try GIF or PNG sequence.");
    const stream = canvas.captureStream(0);
    const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));
    recorder.start();
    const frameInterval = 1000 / fps;
    for (let i = 0; i < total; i++) {
      checkAbort(signal);
      renderFrame(ctx, doc, Math.min(i * frameInterval, durationMs), opts);
      track.requestFrame();
      onProgress?.({ phase: "rendering", frame: i + 1, total });
      await new Promise((r) => setTimeout(r, frameInterval));
    }
    recorder.stop();
    await stopped;
    const blob = new Blob(chunks, { type: "video/webm" });
    onProgress?.({ phase: "done", frame: total, total });
    return { blob, fileName: `foodmotion-${stamp}.webm`, mimeType: "video/webm", frameCount: total };
  }

  if (format === "png_sequence") {
    const zip = new JSZip();
    const folder = zip.folder("frames")!;
    for (let i = 0; i < total; i++) {
      checkAbort(signal);
      renderFrame(ctx, doc, Math.min((i / fps) * 1000, durationMs), opts);
      const blob = await canvasToBlob(canvas, "image/png");
      folder.file(`frame_${String(i).padStart(4, "0")}.png`, blob);
      onProgress?.({ phase: "rendering", frame: i + 1, total });
      if (i % 5 === 0) await yieldToMain();
    }
    onProgress?.({ phase: "encoding", frame: total, total });
    zip.file("README.txt", `FoodMotion Studio PNG sequence\n${total} frames @ ${fps}fps, ${width}x${height}\nImport into any editor at ${fps} fps.`);
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    onProgress?.({ phase: "done", frame: total, total });
    return { blob, fileName: `foodmotion-${stamp}-frames.zip`, mimeType: "application/zip", frameCount: total };
  }

  // GIF
  const gif = GIFEncoder();
  const delay = Math.round(1000 / fps);
  for (let i = 0; i < total; i++) {
    checkAbort(signal);
    renderFrame(ctx, doc, Math.min((i / fps) * 1000, durationMs), opts);
    const { data } = ctx.getImageData(0, 0, width, height);
    const palette = quantize(data, 256, { format: "rgb444" });
    const index = applyPalette(data, palette, "rgb444");
    gif.writeFrame(index, width, height, { palette, delay });
    onProgress?.({ phase: "rendering", frame: i + 1, total });
    if (i % 3 === 0) await yieldToMain();
  }
  onProgress?.({ phase: "encoding", frame: total, total });
  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
  onProgress?.({ phase: "done", frame: total, total });
  return { blob, fileName: `foodmotion-${stamp}.gif`, mimeType: "image/gif", frameCount: total };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to encode frame"))), type));
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
