import { TopBar } from "@/components/layout/TopBar";
import { WorkstationGrid } from "@/components/workstation/WorkstationGrid";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopBar />
      <main className="flex-1">
        <WorkstationGrid />
      </main>
      <Footer />
    </div>
  );
}
