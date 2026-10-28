import type { AnimationDocument, Layer, Scene, TransitionName } from "./types";
import { LIMITS } from "./types";

export function uid(prefix = "id") {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${rand}`;
}

export function emptyDocument(): AnimationDocument {
  return { version: 1, scenes: [createScene("Scene 1")] };
}

export function createScene(name: string, partial: Partial<Scene> = {}): Scene {
  return {
    id: uid("scene"),
    name,
    durationMs: 3000,
    transition: "fade",
    transitionMs: 400,
    background: { kind: "gradient", from: "#1f1814", to: "#44352c", angle: 135 },
    layers: [],
    ...partial,
  };
}

export function totalDuration(doc: AnimationDocument) {
  return doc.scenes.reduce((sum, s) => sum + s.durationMs, 0);
}

/** Locate the scene and local normalised time for an absolute document time. */
export function locateScene(doc: AnimationDocument, timeMs: number) {
  let cursor = 0;
  for (let i = 0; i < doc.scenes.length; i++) {
    const scene = doc.scenes[i];
    if (timeMs < cursor + scene.durationMs || i === doc.scenes.length - 1) {
      const local = Math.min(Math.max(timeMs - cursor, 0), scene.durationMs);
      return { index: i, scene, localMs: local, t: scene.durationMs ? local / scene.durationMs : 0, startMs: cursor };
    }
    cursor += scene.durationMs;
  }
  return null;
}

export function cloneDocument<T>(value: T): T {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

export function duplicateLayer(layer: Layer): Layer {
  return { ...cloneDocument(layer), id: uid("layer"), name: `${layer.name} copy`, x: layer.x + 24, y: layer.y + 24 };
}

export function duplicateScene(scene: Scene): Scene {
  return {
    ...cloneDocument(scene),
    id: uid("scene"),
    name: `${scene.name} copy`,
    layers: scene.layers.map((l) => ({ ...cloneDocument(l), id: uid("layer") })),
  };
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(Math.max(0, Math.min(to, copy.length)), 0, item);
  return copy;
}

export const TRANSITIONS: { id: TransitionName; label: string }[] = [
  { id: "cut", label: "Cut" },
  { id: "fade", label: "Fade" },
  { id: "slide-left", label: "Slide left" },
  { id: "slide-up", label: "Slide up" },
  { id: "zoom", label: "Zoom" },
];

/** Enforce document limits; returns a list of human-readable problems (empty = valid). */
export function validateDocumentLimits(doc: AnimationDocument): string[] {
  const problems: string[] = [];
  if (doc.scenes.length === 0) problems.push("A project needs at least one scene.");
  if (doc.scenes.length > LIMITS.maxScenes) problems.push(`Maximum ${LIMITS.maxScenes} scenes per project.`);
  for (const s of doc.scenes) {
    if (s.layers.length > LIMITS.maxLayersPerScene) problems.push(`Scene "${s.name}" has too many layers (max ${LIMITS.maxLayersPerScene}).`);
    if (s.durationMs < LIMITS.minSceneDurationMs || s.durationMs > LIMITS.maxSceneDurationMs)
      problems.push(`Scene "${s.name}" duration must be between ${LIMITS.minSceneDurationMs / 1000}s and ${LIMITS.maxSceneDurationMs / 1000}s.`);
    for (const l of s.layers) {
      if (l.type === "text" && l.text.length > LIMITS.maxTextLength) problems.push(`Text layer "${l.name}" is too long.`);
    }
  }
  return problems;
}
