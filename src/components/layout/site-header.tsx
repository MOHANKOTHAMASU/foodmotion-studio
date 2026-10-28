"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./logo";
import { mainNav } from "@/lib/site";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeaderUser = { id: string; name: string; avatarUrl?: string | null; roles: string[] } | null;

export function SiteHeader({ user, dark = false }: { user: HeaderUser; dark?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const dashboardHref = user?.roles.includes("admin")
    ? "/admin"
    : user?.roles.includes("business_owner")
      ? "/business"
      : "/dashboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled || open
          ? "border-b border-cream-200 bg-cream-50/90 backdrop-blur-md"
          : dark
            ? "bg-transparent"
            : "bg-cream-50/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo light={dark && !scrolled && !open} />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  dark && !scrolled ? "text-cream-100 hover:bg-white/10" : "text-espresso-700 hover:bg-cream-200",
                  active && (dark && !scrolled ? "bg-white/15" : "bg-cream-200 text-espresso-900"),
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href={dashboardHref} className={buttonClasses("ghost", "sm", dark && !scrolled ? "text-cream-50 hover:bg-white/10" : "")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/account" className={buttonClasses("outline", "sm", dark && !scrolled ? "border-white/30 text-cream-50 hover:bg-white/10" : "")}>
                <UserIcon className="h-4 w-4" /> {user.name.split(" ")[0] || "Account"}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonClasses("ghost", "sm", dark && !scrolled ? "text-cream-50 hover:bg-white/10" : "")}>
                Log in
              </Link>
              <Link href="/register" className={buttonClasses("primary", "sm")}>
                Start creating
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className={cn("rounded-full p-2 md:hidden", dark && !scrolled && !open ? "text-cream-50" : "text-espresso-900")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cream-200 bg-cream-50 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-base font-medium text-espresso-800 hover:bg-cream-200">
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-cream-200 pt-4">
                {user ? (
                  <>
                    <Link href={dashboardHref} className={buttonClasses("secondary", "md")}>Dashboard</Link>
                    <Link href="/account" className={buttonClasses("outline", "md")}>Account</Link>
                    <form action="/auth/signout" method="post">
                      <button type="submit" className={buttonClasses("ghost", "md", "w-full")}>
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={buttonClasses("outline", "md")}>Log in</Link>
                    <Link href="/register" className={buttonClasses("primary", "md")}>Start creating</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
