import { clamp01, easings, lerp } from "./easing";
import type { Keyframe, Layer } from "./types";

export type ResolvedTransform = { x: number; y: number; rotation: number; scale: number; opacity: number };

const DEFAULT_KF: Required<Omit<Keyframe, "t" | "easing">> = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

/** Sorts keyframes by time and fills missing channels from the previous keyframe. */
export type NormalisedKeyframe = Required<Omit<Keyframe, "easing">> & { easing?: Keyframe["easing"] };

export function normaliseKeyframes(keyframes: Keyframe[]): NormalisedKeyframe[] {
  const sorted = [...keyframes].sort((a, b) => a.t - b.t);
  const out: NormalisedKeyframe[] = [];
  let prev = { ...DEFAULT_KF };
  for (const kf of sorted) {
    const filled = {
      t: clamp01(kf.t),
      x: kf.x ?? prev.x,
      y: kf.y ?? prev.y,
      rotation: kf.rotation ?? prev.rotation,
      scale: kf.scale ?? prev.scale,
      opacity: kf.opacity ?? prev.opacity,
      easing: kf.easing,
    };
    out.push(filled);
    prev = filled;
  }
  return out;
}

/** Evaluate keyframe channels at normalised scene time `t` (0..1). */
export function evaluateKeyframes(keyframes: Keyframe[], t: number): ResolvedTransform {
  if (!keyframes.length) return { ...DEFAULT_KF };
  const kfs = normaliseKeyframes(keyframes);
  const time = clamp01(t);
  if (time <= kfs[0].t) return pick(kfs[0]);
  const last = kfs[kfs.length - 1];
  if (time >= last.t) return pick(last);
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (time >= a.t && time <= b.t) {
      const span = b.t - a.t || 1;
      const local = (time - a.t) / span;
      const eased = easings[b.easing ?? "easeInOut"](local);
      return {
        x: lerp(a.x, b.x, eased),
        y: lerp(a.y, b.y, eased),
        rotation: lerp(a.rotation, b.rotation, eased),
        scale: lerp(a.scale, b.scale, eased),
        opacity: lerp(a.opacity, b.opacity, eased),
      };
    }
  }
  return pick(last);
}

function pick(k: { x: number; y: number; rotation: number; scale: number; opacity: number }): ResolvedTransform {
  return { x: k.x, y: k.y, rotation: k.rotation, scale: k.scale, opacity: k.opacity };
}

/** Combine a layer's base transform with its keyframe animation. Positions are in canvas px. */
export function resolveLayerTransform(layer: Layer, t: number): ResolvedTransform {
  const k = evaluateKeyframes(layer.keyframes, t);
  return {
    x: layer.x + k.x,
    y: layer.y + k.y,
    rotation: layer.rotation + k.rotation,
    scale: layer.scale * k.scale,
    opacity: clamp01(layer.opacity * k.opacity),
  };
}
