import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-cream-200 text-espresso-700",
  saffron: "bg-saffron-300/60 text-saffron-700",
  basil: "bg-basil-400/20 text-basil-600",
  chili: "bg-chili-400/15 text-chili-600",
  dark: "bg-espresso-900 text-cream-50",
  outline: "border border-espresso-300 text-espresso-700",
} as const;

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
