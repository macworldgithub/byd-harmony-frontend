import Image from "next/image";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3.5 sm:px-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Good Showroom"
            width={120}
            height={24}
            priority
            className="h-8 w-auto"
          />
        </div>
        <span className="hidden text-xs font-semibold tracking-wide text-neutral-400 sm:inline">
          BYD HARMONY GROUP · DMS
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        DEV MODE
      </span>
    </header>
  );
}
