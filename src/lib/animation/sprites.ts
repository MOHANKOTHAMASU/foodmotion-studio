import type { FoodSprite } from "./types";

/**
 * Procedural "vector food" sprites drawn with Canvas 2D. Each sprite is drawn
 * centred on (0,0) within a box of `size` px so layers can be scaled/rotated
 * uniformly by the renderer. These are deliberately stylised (flat, soft
 * shading) so they read well at small sizes and in GIF palettes.
 */

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, fill: string, stroke?: string) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function shade(ctx: Ctx, x: number, y: number, rx: number, ry: number) {
  ellipse(ctx, x, y, rx, ry, "rgba(0,0,0,0.12)");
}

function highlight(ctx: Ctx, x: number, y: number, rx: number, ry: number, a = 0.35) {
  ellipse(ctx, x, y, rx, ry, `rgba(255,255,255,${a})`);
}

/** Deterministic pseudo random so sprinkles/seeds don't flicker between frames. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const SPRITE_LABELS: Record<FoodSprite, string> = {
  plate: "Plate",
  "bun-bottom": "Bun (bottom)",
  "bun-top": "Bun (top)",
  patty: "Patty",
  cheese: "Cheese",
  lettuce: "Lettuce",
  tomato: "Tomato",
  onion: "Onion",
  "pizza-base": "Pizza base",
  "pizza-sauce": "Pizza sauce",
  "pizza-cheese": "Pizza cheese",
  pepperoni: "Pepperoni",
  basil: "Basil",
  "oven-glow": "Oven glow",
  tawa: "Tawa",
  dosa: "Dosa",
  batter: "Batter",
  chutney: "Chutney",
  handi: "Handi",
  "handi-lid": "Handi lid",
  rice: "Rice",
  saffron: "Saffron",
  mint: "Mint",
  "cake-layer": "Cake layer",
  frosting: "Frosting",
  berry: "Berry",
  cup: "Cup",
  coffee: "Coffee",
  "milk-stream": "Milk stream",
  "latte-heart": "Latte heart",
  blender: "Blender",
  "fruit-slice": "Fruit slice",
  smoothie: "Smoothie",
  cone: "Cone",
  scoop: "Scoop",
  sprinkles: "Sprinkles",
  dessert: "Dessert",
  "chocolate-pour": "Chocolate pour",
  cloche: "Cloche",
  dish: "Plated dish",
};

export const SPRITE_GROUPS: { label: string; sprites: FoodSprite[] }[] = [
  { label: "Burger", sprites: ["plate", "bun-bottom", "patty", "cheese", "lettuce", "tomato", "onion", "bun-top"] },
  { label: "Pizza", sprites: ["pizza-base", "pizza-sauce", "pizza-cheese", "pepperoni", "basil", "oven-glow"] },
  { label: "Dosa", sprites: ["tawa", "batter", "dosa", "chutney"] },
  { label: "Biryani", sprites: ["handi", "rice", "saffron", "mint", "handi-lid"] },
  { label: "Cake", sprites: ["cake-layer", "frosting", "berry"] },
  { label: "Coffee", sprites: ["cup", "coffee", "milk-stream", "latte-heart"] },
  { label: "Fruit", sprites: ["blender", "fruit-slice", "smoothie"] },
  { label: "Ice cream", sprites: ["cone", "scoop", "sprinkles"] },
  { label: "Dessert", sprites: ["dessert", "chocolate-pour"] },
  { label: "Reveal", sprites: ["cloche", "dish"] },
];

export function drawSprite(ctx: Ctx, sprite: FoodSprite, size: number, tint?: string, time = 0) {
  const s = size / 2;
  switch (sprite) {
    case "plate":
      ellipse(ctx, 0, 0, s, s * 0.42, "#f3ede4", "#d9cfc1");
      ellipse(ctx, 0, 0, s * 0.78, s * 0.32, "#e9e1d4");
      break;
    case "bun-bottom":
      shade(ctx, 0, s * 0.28, s * 0.9, s * 0.16);
      roundRect(ctx, -s, -s * 0.25, size, s * 0.5, s * 0.18, tint ?? "#d79a52");
      highlight(ctx, -s * 0.3, -s * 0.12, s * 0.35, s * 0.08, 0.25);
      break;
    case "bun-top": {
      ctx.beginPath();
      ctx.moveTo(-s, s * 0.2);
      ctx.quadraticCurveTo(-s, -s * 0.5, 0, -s * 0.5);
      ctx.quadraticCurveTo(s, -s * 0.5, s, s * 0.2);
      ctx.closePath();
      ctx.fillStyle = tint ?? "#e0a95c";
      ctx.fill();
      highlight(ctx, -s * 0.35, -s * 0.22, s * 0.3, s * 0.1, 0.3);
      const rnd = seeded(7);
      ctx.fillStyle = "#fbefd8";
      for (let i = 0; i < 9; i++) {
        const x = (rnd() - 0.5) * s * 1.4;
        const y = -s * 0.42 + rnd() * s * 0.4 + Math.abs(x) * 0.25;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rnd() * Math.PI);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.06, s * 0.03, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "patty":
      shade(ctx, 0, s * 0.25, s * 0.95, s * 0.14);
      roundRect(ctx, -s, -s * 0.2, size, s * 0.4, s * 0.12, tint ?? "#5a3a2a");
      highlight(ctx, -s * 0.25, -s * 0.1, s * 0.4, s * 0.06, 0.12);
      break;
    case "cheese":
      ctx.save();
      ctx.rotate(0.05);
      roundRect(ctx, -s, -s * 0.12, size, s * 0.24, 4, tint ?? "#f5c542");
      ctx.beginPath();
      ctx.moveTo(s * 0.7, s * 0.12);
      ctx.lineTo(s * 0.78, s * 0.45);
      ctx.lineTo(s * 0.55, s * 0.12);
      ctx.fillStyle = tint ?? "#f5c542";
      ctx.fill();
      ctx.restore();
      break;
    case "lettuce": {
      ctx.fillStyle = tint ?? "#6db86b";
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const x = -s + (i / 12) * size;
        const y = (i % 2 ? -1 : 1) * s * 0.16;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.quadraticCurveTo(x - size / 24, y * 1.6, x, y);
      }
      ctx.lineTo(s, s * 0.1);
      ctx.lineTo(-s, s * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "tomato":
      for (const x of [-s * 0.45, s * 0.45]) {
        ellipse(ctx, x, 0, s * 0.42, s * 0.16, tint ?? "#d8402f");
        ellipse(ctx, x, 0, s * 0.3, s * 0.1, "#ef6a55");
      }
      break;
    case "onion":
      for (const x of [-s * 0.4, s * 0.35]) {
        ctx.beginPath();
        ctx.ellipse(x, 0, s * 0.38, s * 0.14, 0, 0, Math.PI * 2);
        ctx.strokeStyle = tint ?? "#c9a1d7";
        ctx.lineWidth = Math.max(2, s * 0.06);
        ctx.stroke();
      }
      break;
    case "pizza-base":
      ellipse(ctx, 0, 0, s, s, tint ?? "#e3b06f", "#c98f4a");
      ellipse(ctx, 0, 0, s * 0.86, s * 0.86, "#f0c687");
      break;
    case "pizza-sauce":
      ellipse(ctx, 0, 0, s * 0.82, s * 0.82, tint ?? "#c23a2a");
      break;
    case "pizza-cheese": {
      ctx.fillStyle = tint ?? "#f8dc7a";
      ctx.beginPath();
      const rnd = seeded(3);
      for (let i = 0; i <= 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        const r = s * (0.72 + rnd() * 0.08);
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "pepperoni": {
      const rnd = seeded(11);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.4;
        const r = i === 0 ? 0 : s * 0.5;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        ellipse(ctx, x, y, s * 0.15, s * 0.15, tint ?? "#a8322a", "#7d1f19");
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        for (let d = 0; d < 3; d++) {
          ctx.beginPath();
          ctx.arc(x + (rnd() - 0.5) * s * 0.16, y + (rnd() - 0.5) * s * 0.16, s * 0.02, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "basil":
    case "mint": {
      ctx.fillStyle = tint ?? (sprite === "basil" ? "#2f7a3e" : "#4a9c5a");
      for (const [x, y, rot] of [
        [-s * 0.35, -s * 0.1, -0.6],
        [s * 0.3, s * 0.2, 0.7],
        [0, -s * 0.4, 0.1],
      ]) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.3);
        ctx.quadraticCurveTo(s * 0.25, -s * 0.05, 0, s * 0.3);
        ctx.quadraticCurveTo(-s * 0.25, -s * 0.05, 0, -s * 0.3);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.25);
        ctx.lineTo(0, s * 0.25);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case "oven-glow": {
      const g = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s);
      g.addColorStop(0, tint ?? "rgba(255,170,60,0.9)");
      g.addColorStop(0.5, "rgba(255,110,30,0.35)");
      g.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-s, -s, size, size);
      break;
    }
    case "tawa":
      ellipse(ctx, 0, 0, s, s * 0.55, "#2b2b2e", "#111");
      ellipse(ctx, 0, 0, s * 0.9, s * 0.47, "#3a3a3f");
      highlight(ctx, -s * 0.3, -s * 0.15, s * 0.3, s * 0.08, 0.08);
      break;
    case "batter":
      ellipse(ctx, 0, 0, s, s * 0.55, tint ?? "#f4e9d3");
      break;
    case "dosa": {
      ellipse(ctx, 0, 0, s, s * 0.55, tint ?? "#e0a24b");
      const rnd = seeded(5);
      ctx.fillStyle = "rgba(120,70,20,0.35)";
      for (let i = 0; i < 70; i++) {
        const a = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd()) * 0.95;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * s, Math.sin(a) * r * s * 0.55, s * (0.01 + rnd() * 0.02), 0, Math.PI * 2);
        ctx.fill();
      }
      highlight(ctx, -s * 0.35, -s * 0.2, s * 0.3, s * 0.08, 0.18);
      break;
    }
    case "chutney":
      ellipse(ctx, -s * 0.5, 0, s * 0.3, s * 0.18, "#f1ede6", "#d9d1c4");
      ellipse(ctx, -s * 0.5, -s * 0.02, s * 0.22, s * 0.12, "#f8f6f1");
      ellipse(ctx, s * 0.5, 0, s * 0.3, s * 0.18, "#f1ede6", "#d9d1c4");
      ellipse(ctx, s * 0.5, -s * 0.02, s * 0.22, s * 0.12, tint ?? "#5ca04e");
      break;
    case "handi":
      ctx.beginPath();
      ctx.moveTo(-s * 0.75, -s * 0.3);
      ctx.bezierCurveTo(-s * 1.05, s * 0.2, -s * 0.7, s * 0.7, 0, s * 0.7);
      ctx.bezierCurveTo(s * 0.7, s * 0.7, s * 1.05, s * 0.2, s * 0.75, -s * 0.3);
      ctx.closePath();
      ctx.fillStyle = tint ?? "#8b5a3c";
      ctx.fill();
      roundRect(ctx, -s * 0.8, -s * 0.38, s * 1.6, s * 0.14, 6, "#6f4530");
      highlight(ctx, -s * 0.4, s * 0.05, s * 0.25, s * 0.3, 0.1);
      break;
    case "handi-lid":
      ellipse(ctx, 0, 0, s * 0.82, s * 0.2, tint ?? "#a56b48", "#7a4a30");
      ctx.beginPath();
      ctx.arc(0, -s * 0.12, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#5c3722";
      ctx.fill();
      break;
    case "rice": {
      const rnd = seeded(21);
      for (let i = 0; i < 60; i++) {
        const x = (rnd() - 0.5) * size;
        const y = (rnd() - 0.5) * s * 0.6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rnd() * Math.PI);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.08, s * 0.025, 0, 0, Math.PI * 2);
        ctx.fillStyle = rnd() > 0.7 ? "#f0b14b" : tint ?? "#fbf3df";
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "saffron": {
      ctx.strokeStyle = tint ?? "#e0661e";
      ctx.lineWidth = Math.max(1.5, s * 0.04);
      const rnd = seeded(9);
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        const x = (rnd() - 0.5) * size;
        const y = (rnd() - 0.5) * s * 0.6;
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + s * 0.1, y - s * 0.1, x + s * 0.2, y + s * 0.05);
        ctx.stroke();
      }
      break;
    }
    case "cake-layer":
      shade(ctx, 0, s * 0.3, s * 0.95, s * 0.15);
      roundRect(ctx, -s, -s * 0.3, size, s * 0.6, 6, tint ?? "#c98a5a");
      roundRect(ctx, -s, -s * 0.3, size, s * 0.14, 6, "#f3e3dc");
      break;
    case "frosting": {
      ctx.fillStyle = tint ?? "#f6d8e0";
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      for (let i = 0; i <= 10; i++) {
        const x = -s + (i / 10) * size;
        ctx.quadraticCurveTo(x - size / 20, (i % 2 ? 1 : -1) * s * 0.18, x, 0);
      }
      ctx.lineTo(s, -s * 0.25);
      ctx.lineTo(-s, -s * 0.25);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "berry":
      ellipse(ctx, 0, 0, s * 0.42, s * 0.5, tint ?? "#b4233b");
      ellipse(ctx, 0, -s * 0.45, s * 0.2, s * 0.12, "#3f8a3f");
      highlight(ctx, -s * 0.12, -s * 0.12, s * 0.12, s * 0.16, 0.35);
      break;
    case "cup":
      roundRect(ctx, -s * 0.6, -s * 0.5, s * 1.2, s * 1.1, s * 0.2, tint ?? "#f6f1e9");
      ctx.beginPath();
      ctx.ellipse(s * 0.7, 0, s * 0.22, s * 0.3, 0, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = tint ?? "#f6f1e9";
      ctx.lineWidth = s * 0.14;
      ctx.stroke();
      ellipse(ctx, 0, -s * 0.5, s * 0.6, s * 0.18, "#e9e0d2", "#d6cab8");
      break;
    case "coffee":
      ellipse(ctx, 0, 0, s * 0.52, s * 0.15, tint ?? "#4a2c1a");
      ellipse(ctx, 0, 0, s * 0.44, s * 0.11, "#6a3f25");
      break;
    case "milk-stream": {
      ctx.fillStyle = tint ?? "#fffaf2";
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, -s);
      ctx.quadraticCurveTo(-s * 0.1 + Math.sin(time * 6) * s * 0.03, 0, -s * 0.06, s);
      ctx.lineTo(s * 0.06, s);
      ctx.quadraticCurveTo(s * 0.1 + Math.sin(time * 6) * s * 0.03, 0, s * 0.12, -s);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "latte-heart":
      ctx.save();
      ctx.scale(1, 0.4);
      ctx.fillStyle = tint ?? "#fff6ea";
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.7, -s * 0.2, -s * 0.3, -s * 0.7, 0, -s * 0.25);
      ctx.bezierCurveTo(s * 0.3, -s * 0.7, s * 0.7, -s * 0.2, 0, s * 0.35);
      ctx.fill();
      ctx.restore();
      break;
    case "blender":
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, -s);
      ctx.lineTo(s * 0.55, -s);
      ctx.lineTo(s * 0.4, s * 0.5);
      ctx.lineTo(-s * 0.4, s * 0.5);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      roundRect(ctx, -s * 0.5, s * 0.5, size, s * 0.5, 8, tint ?? "#2a2a2e");
      roundRect(ctx, -s * 0.6, -s * 1.12, s * 1.2, s * 0.14, 6, "#2a2a2e");
      break;
    case "fruit-slice": {
      const c = tint ?? "#ff9a3c";
      ellipse(ctx, 0, 0, s * 0.5, s * 0.5, c);
      ellipse(ctx, 0, 0, s * 0.4, s * 0.4, "#ffe2b8");
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((i / 8) * Math.PI * 2) * s * 0.4, Math.sin((i / 8) * Math.PI * 2) * s * 0.4);
        ctx.stroke();
      }
      break;
    }
    case "smoothie":
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.6);
      ctx.lineTo(s * 0.5, -s * 0.6);
      ctx.lineTo(s * 0.38, s * 0.55);
      ctx.lineTo(-s * 0.38, s * 0.55);
      ctx.closePath();
      ctx.fillStyle = tint ?? "#ff6f91";
      ctx.fill();
      ellipse(ctx, 0, -s * 0.6, s * 0.5, s * 0.1, "#ffb3c6");
      break;
    case "cone":
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.5);
      ctx.lineTo(s * 0.5, -s * 0.5);
      ctx.lineTo(0, s);
      ctx.closePath();
      ctx.fillStyle = tint ?? "#d9a066";
      ctx.fill();
      ctx.strokeStyle = "rgba(90,50,20,0.35)";
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(-s * 0.5 + i * s * 0.18, -s * 0.5);
        ctx.lineTo(s * 0.25 + i * s * 0.1, s * 0.6);
        ctx.stroke();
      }
      break;
    case "scoop":
      ellipse(ctx, 0, 0, s * 0.55, s * 0.52, tint ?? "#f7c8d6");
      highlight(ctx, -s * 0.18, -s * 0.18, s * 0.18, s * 0.14, 0.4);
      break;
    case "sprinkles": {
      const rnd = seeded(33);
      const colors = ["#ff5c7a", "#ffd166", "#06d6a0", "#4cc9f0", "#f72585"];
      for (let i = 0; i < 26; i++) {
        ctx.save();
        ctx.translate((rnd() - 0.5) * size, (rnd() - 0.5) * s * 0.9);
        ctx.rotate(rnd() * Math.PI);
        roundRect(ctx, -s * 0.07, -s * 0.02, s * 0.14, s * 0.04, 2, colors[i % colors.length]);
        ctx.restore();
      }
      break;
    }
    case "dessert":
      roundRect(ctx, -s * 0.5, -s * 0.2, size, s * 0.7, 8, tint ?? "#6b3d2e");
      roundRect(ctx, -s * 0.5, -s * 0.2, size, s * 0.12, 8, "#8a5340");
      ellipse(ctx, 0, s * 0.55, s * 0.8, s * 0.14, "#f2ece2", "#dcd2c3");
      break;
    case "chocolate-pour": {
      ctx.fillStyle = tint ?? "#3d2316";
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, -s);
      ctx.quadraticCurveTo(-s * 0.08, 0, -s * 0.5, s * 0.9);
      ctx.quadraticCurveTo(0, s * 1.1, s * 0.5, s * 0.9);
      ctx.quadraticCurveTo(s * 0.08, 0, s * 0.1, -s);
      ctx.closePath();
      ctx.fill();
      highlight(ctx, -s * 0.03, -s * 0.3, s * 0.03, s * 0.5, 0.25);
      break;
    }
    case "cloche":
      ctx.beginPath();
      ctx.arc(0, s * 0.2, s * 0.9, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = tint ?? "#cfd2d6";
      ctx.fill();
      highlight(ctx, -s * 0.4, -s * 0.3, s * 0.2, s * 0.35, 0.45);
      roundRect(ctx, -s * 0.12, -s * 0.85, s * 0.24, s * 0.16, 6, "#9ea3a9");
      break;
    case "dish":
      ellipse(ctx, 0, s * 0.2, s, s * 0.4, "#f5f0e8", "#d8cfc2");
      ellipse(ctx, 0, s * 0.15, s * 0.55, s * 0.26, tint ?? "#c7542e");
      ellipse(ctx, -s * 0.1, s * 0.08, s * 0.3, s * 0.12, "#e8743f");
      ctx.fillStyle = "#3f8a3f";
      for (const [x, y] of [[-s * 0.2, s * 0.05], [s * 0.18, s * 0.12], [0, s * 0.22]]) {
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.06, s * 0.03, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
}
