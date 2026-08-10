import { workstations } from "@/lib/data/workstations";
import { WorkstationCard } from "./WorkstationCard";

export function WorkstationGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          SELECT WORKSTATION
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Select your workstation
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500">
          During development, choose any role to preview and test that workstation&apos;s full
          functionality. In production this screen is replaced by authentication.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workstations.map((w) => (
          <WorkstationCard key={w.slug} workstation={w} />
        ))}
      </div>
    </section>
  );
}
