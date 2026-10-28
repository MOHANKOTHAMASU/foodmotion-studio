/**
 * FoodMotion animation document model.
 * A project document is a list of scenes; each scene has ordered layers; each
 * layer has keyframes describing transform/opacity over the scene's normalised
 * time (0..1). The renderer (renderer.ts) draws any document onto a Canvas 2D
 * context at an absolute time, which powers both playback and export.
 */

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export const ASPECT_DIMENSIONS: Record<AspectRatio, { w: number; h: number }> = {
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
  "1:1": { w: 1080, h: 1080 },
  "4:5": { w: 1080, h: 1350 },
};

export const RESOLUTION_PRESETS = [
  { id: "preview", label: "Preview (0.5×)", scale: 0.5 },
  { id: "standard", label: "Standard (1×)", scale: 1 },
  { id: "hd", label: "High (1.5×)", scale: 1.5 },
] as const;
export type ResolutionPresetId = (typeof RESOLUTION_PRESETS)[number]["id"];

export type EasingName =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "backOut"
  | "bounceOut"
  | "elasticOut"
  | "anticipate";

export type Keyframe = {
  /** normalised time inside the scene, 0..1 */
  t: number;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  easing?: EasingName;
};

export type FoodSprite =
  | "plate"
  | "bun-bottom"
  | "bun-top"
  | "patty"
  | "cheese"
  | "lettuce"
  | "tomato"
  | "onion"
  | "pizza-base"
  | "pizza-sauce"
  | "pizza-cheese"
  | "pepperoni"
  | "basil"
  | "oven-glow"
  | "tawa"
  | "dosa"
  | "batter"
  | "chutney"
  | "handi"
  | "handi-lid"
  | "rice"
  | "saffron"
  | "mint"
  | "cake-layer"
  | "frosting"
  | "berry"
  | "cup"
  | "coffee"
  | "milk-stream"
  | "latte-heart"
  | "blender"
  | "fruit-slice"
  | "smoothie"
  | "cone"
  | "scoop"
  | "sprinkles"
  | "dessert"
  | "chocolate-pour"
  | "cloche"
  | "dish";

export type LayerBase = {
  id: string;
  name: string;
  visible: boolean;
  locked?: boolean;
  /** base transform; keyframes are relative multipliers/offsets applied on top */
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  keyframes: Keyframe[];
};

export type ImageLayer = LayerBase & { type: "image"; src: string; width: number; height: number; radius?: number };
export type TextLayer = LayerBase & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: "display" | "sans";
  color: string;
  weight: 400 | 600 | 700;
  align: "left" | "center" | "right";
  shadow?: boolean;
};
export type ShapeLayer = LayerBase & {
  type: "shape";
  shape: "rect" | "circle" | "pill";
  width: number;
  height: number;
  fill: string;
  stroke?: string;
};
export type FoodLayer = LayerBase & { type: "food"; sprite: FoodSprite; size: number; tint?: string };
export type EffectLayer = LayerBase & {
  type: "effect";
  effect: "steam" | "sparkle" | "confetti" | "glow" | "vignette" | "light-sweep";
  intensity: number;
  color?: string;
  width: number;
  height: number;
};

export type Layer = ImageLayer | TextLayer | ShapeLayer | FoodLayer | EffectLayer;
export type LayerType = Layer["type"];

export type Background =
  | { kind: "solid"; color: string }
  | { kind: "gradient"; from: string; to: string; angle: number }
  | { kind: "image"; src: string; overlay?: string };

export type TransitionName = "cut" | "fade" | "slide-left" | "slide-up" | "zoom";

export type Scene = {
  id: string;
  name: string;
  durationMs: number;
  transition: TransitionName;
  transitionMs: number;
  background: Background;
  layers: Layer[];
};

export type AnimationDocument = {
  version: 1;
  scenes: Scene[];
};

export type ProjectSettings = {
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  fps: 12 | 15 | 24 | 30;
};

export type ExportFormat = "gif" | "png_sequence" | "webm" | "png";

export const LIMITS = {
  maxScenes: 20,
  maxLayersPerScene: 30,
  maxSceneDurationMs: 20_000,
  minSceneDurationMs: 300,
  maxExportFrames: 900,
  maxTextLength: 160,
} as const;
