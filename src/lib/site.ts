export const site = {
  name: "FoodMotion Studio",
  tagline: "Cinematic food animations, menus and discovery — built for Indian food businesses and creators.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: "support@foodmotion.example",
};

export const mainNav = [
  { href: "/explore", label: "Explore" },
  { href: "/templates", label: "Templates" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/studio", label: "Studio" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const footerNav = {
  product: [
    { href: "/studio", label: "Animation Studio" },
    { href: "/templates", label: "Templates" },
    { href: "/explore", label: "Explore Food" },
    { href: "/pricing", label: "Pricing" },
  ],
  business: [
    { href: "/business", label: "Business dashboard" },
    { href: "/restaurants", label: "Directory" },
    { href: "/register?role=business", label: "List your business" },
    { href: "/register?role=creator", label: "Join as creator" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "Help center" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;
