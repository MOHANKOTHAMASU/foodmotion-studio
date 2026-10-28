"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavTabs({ items, className }: { items: { href: string; label: string }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex gap-1 overflow-x-auto rounded-full bg-cream-200/70 p-1", className)} aria-label="Section">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition",
              active ? "bg-white text-espresso-900 shadow-soft" : "text-espresso-600 hover:text-espresso-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
