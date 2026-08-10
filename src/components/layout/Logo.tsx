export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="30"
        height="30"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden
      >
        <path
          d="M8 28C8 28 12 24 20 24C28 24 30 20 30 16C30 11 25 8 19 8C13 8 9 11 8 15"
          stroke="#111111"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 12C32 12 28 16 20 16C12 16 10 20 10 24C10 29 15 32 21 32C27 32 31 29 32 25"
          stroke="#111111"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-neutral-900">Good</p>
          <p className="text-[15px] font-bold tracking-tight text-neutral-900 -mt-1">Showroom</p>
        </div>
      )}
    </div>
  );
}
