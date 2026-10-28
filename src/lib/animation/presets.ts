import { ASPECT_DIMENSIONS, type AnimationDocument, type AspectRatio, type FoodSprite, type Keyframe, type Layer, type Scene } from "./types";
import { createScene, uid } from "./document";

export type TemplateMeta = {
  slug: string;
  name: string;
  category: string;
  description: string;
  durationLabel: string;
  accent: string;
  featured?: boolean;
};

export const TEMPLATES: TemplateMeta[] = [
  { slug: "burger-assembly", name: "Burger assembly", category: "burgers", description: "Ingredients drop and stack into a finished burger, then the name card lands.", durationLabel: "6s · 2 scenes", accent: "#e8882e", featured: true },
  { slug: "pizza-oven", name: "Pizza oven sequence", category: "pizza", description: "Dough, sauce swirl, cheese and pepperoni, then a fiery oven glow.", durationLabel: "7s · 2 scenes", accent: "#c6362f", featured: true },
  { slug: "dosa-spread", name: "Dosa spread", category: "dosa", description: "Batter spreads across the tawa and crisps to golden; chutneys slide in.", durationLabel: "6s · 2 scenes", accent: "#d79a52", featured: true },
  { slug: "biryani-dum", name: "Biryani dum", category: "biryani", description: "Rice, saffron and mint layer into the handi; the lid seals and steam rises.", durationLabel: "7s · 2 scenes", accent: "#e0661e", featured: true },
  { slug: "cake-frosting", name: "Cake frosting", category: "cakes", description: "Layers stack, frosting ripples on and berries bounce into place.", durationLabel: "6s · 2 scenes", accent: "#e98fa8" },
  { slug: "coffee-pour", name: "Coffee pour & latte art", category: "coffee", description: "Milk streams into the cup, swirls and leaves a heart.", durationLabel: "6s · 2 scenes", accent: "#8a5a3c", featured: true },
  { slug: "fruit-smoothie", name: "Fruit cut & blend", category: "fruit", description: "Fruit slices tumble into the blender, whirl and pour out a smoothie.", durationLabel: "7s · 3 scenes", accent: "#ff6f91" },
  { slug: "ice-cream-scoop", name: "Ice cream scoop", category: "ice-cream", description: "Scoops land one-by-one on the cone and sprinkles rain down.", durationLabel: "6s · 2 scenes", accent: "#f7c8d6" },
  { slug: "chocolate-pour", name: "Chocolate pour", category: "desserts", description: "Molten chocolate cascades over the dessert with a light sweep.", durationLabel: "6s · 2 scenes", accent: "#5a3a2a" },
  { slug: "dish-reveal", name: "Cinematic dish reveal", category: "thali", description: "The cloche lifts, steam rises, a light sweep and the dish title fades in.", durationLabel: "7s · 2 scenes", accent: "#c7542e", featured: true },
];

export const TEMPLATE_SLUGS = TEMPLATES.map((t) => t.slug);

type Dim = { w: number; h: number };

function food(sprite: FoodSprite, x: number, y: number, size: number, keyframes: Keyframe[], extra: Partial<Layer> = {}): Layer {
  return {
    id: uid("layer"),
    name: sprite.replace(/-/g, " "),
    type: "food",
    sprite,
    size,
    visible: true,
    x,
    y,
    rotation: 0,
    scale: 1,
    opacity: 1,
    keyframes,
    ...(extra as object),
  } as Layer;
}

function text(label: string, x: number, y: number, fontSize: number, keyframes: Keyframe[], opts: Partial<Extract<Layer, { type: "text" }>> = {}): Layer {
  return {
    id: uid("layer"),
    name: `Text: ${label.slice(0, 18)}`,
    type: "text",
    text: label,
    fontSize,
    fontFamily: "display",
    color: "#fdfaf5",
    weight: 600,
    align: "center",
    shadow: true,
    visible: true,
    x,
    y,
    rotation: 0,
    scale: 1,
    opacity: 1,
    keyframes,
    ...opts,
  };
}

function effect(kind: Extract<Layer, { type: "effect" }>["effect"], x: number, y: number, w: number, h: number, intensity: number, keyframes: Keyframe[], color?: string): Layer {
  return {
    id: uid("layer"),
    name: kind,
    type: "effect",
    effect: kind,
    intensity,
    color,
    width: w,
    height: h,
    visible: true,
    x,
    y,
    rotation: 0,
    scale: 1,
    opacity: 1,
    keyframes,
  };
}

const drop = (from: number, start: number, end: number, easing: Keyframe["easing"] = "bounceOut"): Keyframe[] => [
  { t: 0, y: from, opacity: 0 },
  { t: start, y: from, opacity: 0 },
  { t: Math.min(start + 0.02, end), y: from, opacity: 1, easing: "linear" },
  { t: end, y: 0, opacity: 1, easing },
];

const fadeUp = (start: number, end: number): Keyframe[] => [
  { t: 0, y: 30, opacity: 0 },
  { t: start, y: 30, opacity: 0 },
  { t: end, y: 0, opacity: 1, easing: "easeOut" },
];

const hold: Keyframe[] = [];

function titleScene(d: Dim, title: string, subtitle: string, accent: string, heroSprite: FoodSprite, heroSize: number): Scene {
  const cx = d.w / 2;
  const cy = d.h / 2;
  const portrait = d.h > d.w;
  return createScene("Title card", {
    durationMs: 3000,
    transition: "fade",
    transitionMs: 500,
    background: { kind: "gradient", from: "#130f0c", to: accent, angle: 160 },
    layers: [
      effect("vignette", cx, cy, d.w * 1.2, d.h * 1.2, 0.8, hold),
      food(heroSprite, cx, portrait ? cy - d.h * 0.12 : cy - d.h * 0.08, heroSize, [
        { t: 0, scale: 0.7, opacity: 0, rotation: -8 },
        { t: 0.3, scale: 1, opacity: 1, rotation: 0, easing: "backOut" },
        { t: 1, y: -10, rotation: 2, easing: "easeInOut" },
      ]),
      effect("sparkle", cx, cy - d.h * 0.1, d.w * 0.7, d.h * 0.6, 0.8, hold, "#fbe7a1"),
      text(title, cx, portrait ? cy + d.h * 0.18 : cy + d.h * 0.24, Math.round(Math.min(d.w, d.h) * 0.085), fadeUp(0.3, 0.55)),
      text(subtitle, cx, portrait ? cy + d.h * 0.26 : cy + d.h * 0.36, Math.round(Math.min(d.w, d.h) * 0.036), fadeUp(0.45, 0.7), {
        fontFamily: "sans",
        weight: 400,
        color: "#f8f1e6",
      }),
    ],
  });
}

const builders: Record<string, (d: Dim) => Scene[]> = {
  "burger-assembly": (d) => {
    const cx = d.w / 2;
    const base = d.h * 0.66;
    const unit = Math.min(d.w, d.h) * 0.42;
    const layersOrder: [FoodSprite, number][] = [
      ["bun-bottom", 0],
      ["patty", -unit * 0.16],
      ["cheese", -unit * 0.28],
      ["tomato", -unit * 0.36],
      ["lettuce", -unit * 0.44],
      ["onion", -unit * 0.5],
      ["bun-top", -unit * 0.66],
    ];
    return [
      createScene("Assemble", {
        durationMs: 3600,
        background: { kind: "gradient", from: "#1f1814", to: "#5d3a1e", angle: 135 },
        layers: [
          food("plate", cx, base + unit * 0.16, unit * 1.5, [{ t: 0, scale: 0.9, opacity: 0 }, { t: 0.1, scale: 1, opacity: 1, easing: "easeOut" }]),
          ...layersOrder.map(([sprite, dy], i) =>
            food(sprite, cx, base + dy, unit, drop(-d.h * 0.6, 0.08 + i * 0.1, 0.26 + i * 0.1)),
          ),
          effect("sparkle", cx, base - unit * 0.3, unit * 1.6, unit, 0.6, [{ t: 0, opacity: 0 }, { t: 0.85, opacity: 0 }, { t: 1, opacity: 1 }], "#fbe7a1"),
        ],
      }),
      titleScene(d, "The Smash Stack", "Double patty · aged cheddar · house sauce", "#7a3a16", "bun-top", unit * 0.9),
    ];
  },
  "pizza-oven": (d) => {
    const cx = d.w / 2;
    const cy = d.h / 2;
    const size = Math.min(d.w, d.h) * 0.62;
    const pop = (start: number): Keyframe[] => [
      { t: 0, scale: 0, opacity: 0 },
      { t: start, scale: 0, opacity: 0 },
      { t: start + 0.18, scale: 1, opacity: 1, easing: "backOut" },
    ];
    return [
      createScene("Build the pizza", {
        durationMs: 4000,
        background: { kind: "gradient", from: "#2a1a12", to: "#0f0a08", angle: 180 },
        layers: [
          food("pizza-base", cx, cy, size, [{ t: 0, scale: 0.6, opacity: 0, rotation: -40 }, { t: 0.15, scale: 1, opacity: 1, rotation: 0, easing: "backOut" }]),
          food("pizza-sauce", cx, cy, size, [{ t: 0, scale: 0, opacity: 0 }, { t: 0.18, scale: 0, opacity: 1 }, { t: 0.4, scale: 1, rotation: 180, easing: "easeOut" }]),
          food("pizza-cheese", cx, cy, size, pop(0.42)),
          food("pepperoni", cx, cy, size, pop(0.58)),
          food("basil", cx, cy, size * 0.6, pop(0.74)),
          effect("light-sweep", cx, cy, d.w, d.h, 0.7, [{ t: 0, opacity: 0 }, { t: 0.8, opacity: 0 }, { t: 0.85, opacity: 1 }], "#ffd9a0"),
        ],
      }),
      createScene("Into the oven", {
        durationMs: 3000,
        transition: "zoom",
        transitionMs: 600,
        background: { kind: "gradient", from: "#0b0705", to: "#3a1708", angle: 0 },
        layers: [
          food("oven-glow", cx, cy, size * 2.2, [{ t: 0, opacity: 0.4 }, { t: 0.5, opacity: 1, scale: 1.1 }, { t: 1, opacity: 0.7, scale: 1 }], { tint: "rgba(255,150,40,0.95)" } as Partial<Layer>),
          food("pizza-base", cx, cy + 10, size * 0.9, [{ t: 0, scale: 0.9 }, { t: 1, scale: 1, rotation: 12, easing: "easeInOut" }]),
          food("pizza-sauce", cx, cy + 10, size * 0.9, [{ t: 0, scale: 0.9 }, { t: 1, scale: 1, rotation: 12, easing: "easeInOut" }]),
          food("pizza-cheese", cx, cy + 10, size * 0.9, [{ t: 0, scale: 0.9 }, { t: 1, scale: 1, rotation: 12, easing: "easeInOut" }], { tint: "#f7c64f" } as Partial<Layer>),
          food("pepperoni", cx, cy + 10, size * 0.9, [{ t: 0, scale: 0.9 }, { t: 1, scale: 1, rotation: 12, easing: "easeInOut" }]),
          effect("steam", cx, cy - size * 0.2, size, size, 0.7, hold, "#ffe7c2"),
          text("Wood-fired in 90 seconds", cx, d.h * 0.86, Math.round(Math.min(d.w, d.h) * 0.05), fadeUp(0.3, 0.55)),
        ],
      }),
    ];
  },
  "dosa-spread": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.56;
    const size = Math.min(d.w, d.h) * 0.8;
    return [
      createScene("Spread on the tawa", {
        durationMs: 3600,
        background: { kind: "gradient", from: "#16100c", to: "#3d2a1b", angle: 180 },
        layers: [
          food("tawa", cx, cy, size, [{ t: 0, opacity: 0, scale: 0.95 }, { t: 0.1, opacity: 1, scale: 1 }]),
          food("batter", cx, cy, size * 0.86, [{ t: 0, scale: 0.05, opacity: 0 }, { t: 0.12, scale: 0.05, opacity: 1 }, { t: 0.5, scale: 1, rotation: 540, easing: "easeOut" }]),
          food("dosa", cx, cy, size * 0.86, [{ t: 0, opacity: 0 }, { t: 0.5, opacity: 0 }, { t: 0.9, opacity: 1, easing: "easeInOut" }]),
          effect("steam", cx, cy - size * 0.15, size * 0.8, size * 0.5, 0.6, [{ t: 0, opacity: 0 }, { t: 0.55, opacity: 0 }, { t: 0.8, opacity: 1 }], "#fff2dc"),
        ],
      }),
      createScene("Serve", {
        durationMs: 2800,
        transition: "slide-left",
        transitionMs: 500,
        background: { kind: "gradient", from: "#3d2a1b", to: "#d79a52", angle: 150 },
        layers: [
          food("dosa", cx, cy - d.h * 0.05, size * 0.85, [{ t: 0, rotation: -20, x: -d.w * 0.4, opacity: 0 }, { t: 0.35, rotation: 0, x: 0, opacity: 1, easing: "easeOut" }]),
          food("chutney", cx, cy + size * 0.3, size * 0.7, drop(-d.h * 0.4, 0.3, 0.6)),
          text("Ghee Roast Dosa", cx, d.h * 0.16, Math.round(Math.min(d.w, d.h) * 0.08), fadeUp(0.4, 0.65)),
          text("₹120 · ready in 8 minutes", cx, d.h * 0.25, Math.round(Math.min(d.w, d.h) * 0.036), fadeUp(0.5, 0.75), { fontFamily: "sans", weight: 400 }),
        ],
      }),
    ];
  },
  "biryani-dum": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.6;
    const size = Math.min(d.w, d.h) * 0.62;
    return [
      createScene("Layer the handi", {
        durationMs: 4200,
        background: { kind: "gradient", from: "#14100c", to: "#5a2d12", angle: 160 },
        layers: [
          food("handi", cx, cy, size, [{ t: 0, opacity: 0, y: 40 }, { t: 0.12, opacity: 1, y: 0, easing: "easeOut" }]),
          food("rice", cx, cy - size * 0.3, size * 0.9, drop(-d.h * 0.5, 0.15, 0.4, "easeOut")),
          food("saffron", cx, cy - size * 0.36, size * 0.8, drop(-d.h * 0.5, 0.35, 0.55, "easeOut")),
          food("mint", cx, cy - size * 0.42, size * 0.4, drop(-d.h * 0.5, 0.5, 0.68)),
          food("handi-lid", cx, cy - size * 0.42, size, drop(-d.h * 0.6, 0.68, 0.9, "easeOut")),
          effect("steam", cx, cy - size * 0.6, size, size * 0.8, 0.9, [{ t: 0, opacity: 0 }, { t: 0.9, opacity: 0 }, { t: 1, opacity: 1 }], "#fff0dc"),
        ],
      }),
      titleScene(d, "Hyderabadi Dum Biryani", "45 minutes on dum · saffron · mint · fried onions", "#7a3b14", "handi", size * 0.8),
    ];
  },
  "cake-frosting": (d) => {
    const cx = d.w / 2;
    const base = d.h * 0.7;
    const size = Math.min(d.w, d.h) * 0.5;
    return [
      createScene("Stack & frost", {
        durationMs: 4000,
        background: { kind: "gradient", from: "#2b1a22", to: "#7a3d57", angle: 150 },
        layers: [
          food("plate", cx, base + size * 0.2, size * 1.5, [{ t: 0, opacity: 0 }, { t: 0.1, opacity: 1 }]),
          food("cake-layer", cx, base, size, drop(-d.h * 0.5, 0.08, 0.3)),
          food("cake-layer", cx, base - size * 0.3, size, drop(-d.h * 0.5, 0.25, 0.47)),
          food("cake-layer", cx, base - size * 0.6, size, drop(-d.h * 0.5, 0.42, 0.64)),
          food("frosting", cx, base - size * 0.78, size * 1.02, [{ t: 0, opacity: 0, scale: 0.2 }, { t: 0.62, opacity: 0, scale: 0.2 }, { t: 0.8, opacity: 1, scale: 1, easing: "easeOut" }]),
          food("berry", cx - size * 0.25, base - size * 0.95, size * 0.22, drop(-d.h * 0.4, 0.8, 0.95)),
          food("berry", cx + size * 0.2, base - size * 0.97, size * 0.22, drop(-d.h * 0.4, 0.85, 1)),
          effect("confetti", cx, d.h * 0.4, d.w, d.h, 0.6, [{ t: 0, opacity: 0 }, { t: 0.85, opacity: 0 }, { t: 0.95, opacity: 1 }]),
        ],
      }),
      titleScene(d, "Celebration Cakes", "Made to order · 24h notice · eggless options", "#8a3b5e", "berry", size * 0.5),
    ];
  },
  "coffee-pour": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.58;
    const size = Math.min(d.w, d.h) * 0.5;
    return [
      createScene("Pour", {
        durationMs: 3600,
        background: { kind: "gradient", from: "#17110d", to: "#5a3a2a", angle: 170 },
        layers: [
          food("cup", cx, cy, size, [{ t: 0, opacity: 0, y: 30 }, { t: 0.12, opacity: 1, y: 0, easing: "easeOut" }]),
          food("coffee", cx, cy - size * 0.5, size, [{ t: 0, opacity: 0 }, { t: 0.15, opacity: 1 }]),
          food("milk-stream", cx, cy - size * 1.05, size * 0.9, [{ t: 0, opacity: 0, scale: 0 }, { t: 0.2, opacity: 0, scale: 0 }, { t: 0.3, opacity: 1, scale: 1, easing: "easeOut" }, { t: 0.75, opacity: 1, scale: 1 }, { t: 0.85, opacity: 0, scale: 0.2, easing: "easeIn" }]),
          food("latte-heart", cx, cy - size * 0.5, size * 0.8, [{ t: 0, opacity: 0, scale: 0.2 }, { t: 0.6, opacity: 0, scale: 0.2 }, { t: 0.92, opacity: 1, scale: 1, easing: "easeOut" }]),
          effect("steam", cx, cy - size * 0.8, size, size * 0.8, 0.5, hold, "#fff4e6"),
        ],
      }),
      titleScene(d, "Filter Kaapi Latte", "Single origin · 18g dose · oat milk available", "#5a3a2a", "cup", size * 0.7),
    ];
  },
  "fruit-smoothie": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.56;
    const size = Math.min(d.w, d.h) * 0.55;
    const tints = ["#ff9a3c", "#ff5c7a", "#8bd450", "#ffd166"];
    return [
      createScene("Slice & drop", {
        durationMs: 3000,
        background: { kind: "gradient", from: "#13201a", to: "#2f6b4f", angle: 160 },
        layers: [
          food("blender", cx, cy, size, [{ t: 0, opacity: 0, y: 30 }, { t: 0.1, opacity: 1, y: 0 }]),
          ...tints.map((tint, i) =>
            food("fruit-slice", cx + (i - 1.5) * size * 0.18, cy - size * 0.1 + i * 8, size * 0.42, [
              { t: 0, y: -d.h * 0.55, opacity: 0, rotation: -90 },
              { t: 0.15 + i * 0.12, y: -d.h * 0.55, opacity: 1, rotation: -90 },
              { t: 0.4 + i * 0.12, y: 0, rotation: 0, easing: "bounceOut" },
            ], { tint } as Partial<Layer>),
          ),
        ],
      }),
      createScene("Blend", {
        durationMs: 2200,
        transition: "cut",
        transitionMs: 0,
        background: { kind: "gradient", from: "#13201a", to: "#2f6b4f", angle: 160 },
        layers: [
          food("blender", cx, cy, size, [{ t: 0 }, { t: 0.1, x: -3 }, { t: 0.2, x: 3 }, { t: 0.3, x: -3 }, { t: 0.4, x: 3 }, { t: 0.5, x: -2 }, { t: 0.6, x: 2 }, { t: 0.7, x: 0 }]),
          ...tints.map((tint, i) =>
            food("fruit-slice", cx, cy - size * 0.1, size * 0.3, [
              { t: 0, x: (i - 1.5) * size * 0.18, scale: 1 },
              { t: 0.8, rotation: 1080 + i * 90, scale: 0.4, x: 0, easing: "linear" },
              { t: 1, opacity: 0 },
            ], { tint } as Partial<Layer>),
          ),
          food("smoothie", cx, cy + size * 0.05, size * 0.75, [{ t: 0, opacity: 0, scale: 0.6 }, { t: 0.7, opacity: 0, scale: 0.6 }, { t: 1, opacity: 1, scale: 1, easing: "easeOut" }]),
        ],
      }),
      titleScene(d, "Sunrise Smoothie", "Mango · strawberry · kiwi · no added sugar", "#2f6b4f", "smoothie", size * 0.7),
    ];
  },
  "ice-cream-scoop": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.62;
    const size = Math.min(d.w, d.h) * 0.42;
    return [
      createScene("Scoop", {
        durationMs: 3600,
        background: { kind: "gradient", from: "#1d1526", to: "#5c3b7a", angle: 160 },
        layers: [
          food("cone", cx, cy + size * 0.3, size, [{ t: 0, opacity: 0, y: 40, rotation: -10 }, { t: 0.15, opacity: 1, y: 0, rotation: 0, easing: "backOut" }]),
          food("scoop", cx, cy - size * 0.2, size, drop(-d.h * 0.5, 0.2, 0.42), { tint: "#f7c8d6" } as Partial<Layer>),
          food("scoop", cx - size * 0.08, cy - size * 0.62, size * 0.92, drop(-d.h * 0.5, 0.42, 0.64), { tint: "#c9b6ff" } as Partial<Layer>),
          food("scoop", cx + size * 0.05, cy - size * 1.0, size * 0.85, drop(-d.h * 0.5, 0.62, 0.84), { tint: "#f6e3a8" } as Partial<Layer>),
          food("sprinkles", cx, cy - size * 0.7, size * 1.2, [{ t: 0, opacity: 0, y: -d.h * 0.4 }, { t: 0.82, opacity: 0, y: -d.h * 0.4 }, { t: 1, opacity: 1, y: 0, easing: "easeOut" }]),
        ],
      }),
      titleScene(d, "Triple Scoop Sundays", "Rose · blueberry · salted caramel", "#5c3b7a", "scoop", size * 0.9),
    ];
  },
  "chocolate-pour": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.6;
    const size = Math.min(d.w, d.h) * 0.5;
    return [
      createScene("Pour", {
        durationMs: 3600,
        background: { kind: "gradient", from: "#0f0906", to: "#3f2719", angle: 180 },
        layers: [
          food("dessert", cx, cy, size, [{ t: 0, opacity: 0, y: 30 }, { t: 0.12, opacity: 1, y: 0, easing: "easeOut" }]),
          food("chocolate-pour", cx, cy - size * 0.75, size * 0.9, [{ t: 0, opacity: 0, scale: 0.1 }, { t: 0.2, opacity: 0, scale: 0.1 }, { t: 0.45, opacity: 1, scale: 1, easing: "easeOut" }, { t: 0.8, scale: 1 }, { t: 0.95, opacity: 0, scale: 0.4 }]),
          effect("light-sweep", cx, cy, d.w, d.h, 0.8, [{ t: 0, opacity: 0 }, { t: 0.7, opacity: 0 }, { t: 0.8, opacity: 1 }], "#ffd9a0"),
          effect("glow", cx, cy, size * 2, size * 2, 0.4, hold, "#a0623a"),
        ],
      }),
      titleScene(d, "Molten Chocolate Fondant", "Served warm · 70% dark · vanilla bean", "#3f2719", "dessert", size * 0.7),
    ];
  },
  "dish-reveal": (d) => {
    const cx = d.w / 2;
    const cy = d.h * 0.58;
    const size = Math.min(d.w, d.h) * 0.62;
    return [
      createScene("Reveal", {
        durationMs: 4200,
        background: { kind: "gradient", from: "#0c0a09", to: "#2d231d", angle: 180 },
        layers: [
          effect("glow", cx, cy, size * 2.4, size * 2.4, 0.5, [{ t: 0, opacity: 0.2 }, { t: 0.5, opacity: 1 }], "#e8882e"),
          food("dish", cx, cy, size, [{ t: 0, scale: 0.98 }, { t: 1, scale: 1.02, easing: "easeInOut" }]),
          food("cloche", cx, cy - size * 0.1, size * 1.1, [{ t: 0 }, { t: 0.3, y: 0 }, { t: 0.6, y: -d.h * 0.55, rotation: 8, easing: "easeInOut" }, { t: 0.7, opacity: 0 }]),
          effect("steam", cx, cy - size * 0.3, size * 0.9, size * 0.7, 0.8, [{ t: 0, opacity: 0 }, { t: 0.45, opacity: 0 }, { t: 0.65, opacity: 1 }], "#fff2e0"),
          effect("light-sweep", cx, cy, d.w, d.h, 0.9, [{ t: 0, opacity: 0 }, { t: 0.55, opacity: 0 }, { t: 0.62, opacity: 1 }], "#ffe9c7"),
          effect("vignette", cx, cy, d.w * 1.2, d.h * 1.2, 0.9, hold),
          text("Chef's Special", cx, d.h * 0.14, Math.round(Math.min(d.w, d.h) * 0.08), fadeUp(0.6, 0.85)),
        ],
      }),
      titleScene(d, "Tonight's Tasting Menu", "Seven courses · seasonal · book by 6pm", "#5a2d12", "dish", size * 0.8),
    ];
  },
};

export function buildTemplateDocument(slug: string, aspect: AspectRatio = "16:9"): AnimationDocument {
  const dim = ASPECT_DIMENSIONS[aspect];
  const builder = builders[slug];
  if (!builder) throw new Error(`Unknown template: ${slug}`);
  return { version: 1, scenes: builder(dim) };
}

export function getTemplate(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug) ?? null;
}
