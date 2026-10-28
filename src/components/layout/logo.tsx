import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-display text-xl font-semibold", className)} aria-label="FoodMotion Studio home">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-saffron-500 text-espresso-950 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 2v3M12 2v3M16 2v3" />
          <path d="M4 9h16a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7Z" />
          <path d="M6 20h12" />
        </svg>
      </span>
      <span className={light ? "text-cream-50" : "text-espresso-900"}>
        FoodMotion<span className="text-saffron-600"> Studio</span>
      </span>
    </Link>
  );
}
