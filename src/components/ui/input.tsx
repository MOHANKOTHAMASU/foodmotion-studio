import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm text-espresso-900 placeholder:text-espresso-300 transition focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-300 disabled:bg-cream-100 aria-[invalid=true]:border-chili-500";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(base, className)} {...props} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(base, "min-h-[110px] resize-y", className)} {...props} />;
});

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(base, "appearance-none pr-9", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-espresso-800", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-espresso-400">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-chili-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
