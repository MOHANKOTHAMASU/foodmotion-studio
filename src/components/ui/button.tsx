import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-saffron-500 text-espresso-950 hover:bg-saffron-400 shadow-soft hover:shadow-lift",
  secondary: "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
  dark: "bg-espresso-950 text-cream-50 hover:bg-espresso-800 border border-espresso-700",
  ghost: "bg-transparent text-espresso-800 hover:bg-cream-200",
  outline:
    "bg-transparent border border-espresso-300 text-espresso-900 hover:border-espresso-700 hover:bg-cream-100",
  danger: "bg-chili-500 text-white hover:bg-chili-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
}

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, href, children, disabled, type, ...props },
  ref,
) {
  const classes = buttonClasses(variant, size, className);
  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || loading}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={classes} disabled={disabled || loading} type={type ?? "button"} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
