import Image from "next/image";

export function Footer({ compact }: { compact?: boolean } = {}) {
  return (
    <footer className="border-t border-neutral-200 bg-white h-12">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Good Showroom"
            width={120}
            height={24}
            priority
            className="h-6 w-auto"
          />
        </div>

        {/* Right */}
        <span className="text-xs text-neutral-400">
          Development build — authentication disabled
        </span>
      </div>
    </footer>
  );
}

export default Footer;