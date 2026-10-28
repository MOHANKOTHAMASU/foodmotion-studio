import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-100/60 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-espresso-400 shadow-soft">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <h3 className="text-lg font-semibold text-espresso-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-espresso-500">{description}</p>}
      {action && (
        <Button className="mt-5" href={action.href} onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  retry,
}: {
  title?: string;
  description?: string;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-chili-400/40 bg-chili-400/5 px-6 py-12 text-center"
    >
      <AlertTriangle className="mb-3 h-6 w-6 text-chili-500" aria-hidden />
      <h3 className="text-lg font-semibold text-espresso-900">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-espresso-500">{description}</p>}
      {retry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function DemoDataNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-butter-400 bg-butter-300/40 px-3 py-1 text-xs font-medium text-espresso-700">
      <span className="h-1.5 w-1.5 rounded-full bg-saffron-600" aria-hidden />
      {children ?? "Demo data — shown for illustration until real listings are published."}
    </p>
  );
}
