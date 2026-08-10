import { cn } from "@/lib/cn";

type BadgeTone = "green" | "blue" | "orange" | "red" | "purple" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  orange: "bg-orange-50 text-orange-700",
  red: "bg-rose-50 text-rose-700",
  purple: "bg-purple-50 text-purple-700",
  neutral: "bg-neutral-100 text-neutral-600",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
