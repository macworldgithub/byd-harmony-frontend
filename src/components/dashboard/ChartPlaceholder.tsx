export function ChartPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-52 items-center justify-center text-sm text-neutral-400">{message}</div>
  );
}

/** Axis-only placeholder (Customer Acquisition chart in the reference has empty gridlines, no message). */
export function AxisPlaceholder() {
  return (
    <div className="flex h-52 items-end">
      <div className="h-40 w-full border-b border-l border-neutral-200" />
    </div>
  );
}
