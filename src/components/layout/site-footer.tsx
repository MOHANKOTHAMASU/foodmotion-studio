import Link from "next/link";
import { Logo } from "./logo";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream-200 bg-cream-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-espresso-500">{site.tagline}</p>
          <p className="mt-6 text-xs text-espresso-400">Made for kitchens in India and everywhere food moves people.</p>
        </div>
        {(
          [
            ["Product", footerNav.product],
            ["For business", footerNav.business],
            ["Company", footerNav.company],
          ] as const
        ).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-espresso-500">{title}</h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-espresso-700 hover:text-saffron-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-espresso-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Animations are promotional previews. Ordering and payments are only enabled where a business has completed setup.</p>
        </div>
      </div>
    </footer>
  );
}
