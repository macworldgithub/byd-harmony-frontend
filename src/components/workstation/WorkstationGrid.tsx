"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { workstations } from "@/lib/data/workstations";
import { WorkstationCard } from "./WorkstationCard";
import { LoginModal } from "@/components/login/LoginModal";
import { MapPin, ChevronRight } from "lucide-react";
import type { Workstation } from "@/lib/types";

const sites = [
  {
    id: "s-1",
    name: "BYD Caroline Springs",
    detail: "Combined · Caroline Springs",
  },
  { id: "s-2", name: "BYD Nunawading", detail: "Combined · Nunawading" },
  { id: "s-3", name: "Denza Melbourne", detail: "Combined · Melbourne" },
];

export function WorkstationGrid() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Workstation | null>(null);
  const [loginTarget, setLoginTarget] = useState<Workstation | null>(null);

  const handleCardClick = (workstation: Workstation) => {
    if (workstation.slug === "super-admin") {
      // Open login modal for Super Admin
      setLoginTarget(workstation);
    } else if (workstation.slug === "executive") {
      router.push(workstation.href);
    } else {
      // Otherwise, open the site selection modal.
      setSelectedRole(workstation);
    }
  };

  const handleSiteSelect = (siteId: string) => {
    if (selectedRole) {
      router.push(`${selectedRole.href}?site=${siteId}`);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 relative">
      <div className="flex flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          SELECT WORKSTATION
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Select your workstation
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500">
          During development, choose any role to preview and test that
          workstation&apos;s full functionality. In production this screen is
          replaced by authentication.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workstations.map((w) => (
          <WorkstationCard
            key={w.slug}
            workstation={w}
            onClick={() => handleCardClick(w)}
          />
        ))}
      </div>

      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-neutral-900/10 backdrop-blur-sm"
            onClick={() => setSelectedRole(null)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl ring-1 ring-neutral-200">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-neutral-900">
                  Select your site
                </h2>
                <p className="text-sm text-neutral-500">
                  {selectedRole.name} workstation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => handleSiteSelect(site.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                      <MapPin className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {site.name}
                      </p>
                      <p className="text-xs text-neutral-500">{site.detail}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-300" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Login Modal */}
      <LoginModal
        isOpen={loginTarget !== null}
        onClose={() => setLoginTarget(null)}
        redirectHref={loginTarget?.href ?? "/admin"}
      />
    </section>
  );
}
