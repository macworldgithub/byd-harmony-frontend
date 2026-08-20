"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { workstations } from "@/lib/data/workstations";
import { WorkstationCard } from "./WorkstationCard";
import { LoginModal } from "@/components/login/LoginModal";
import { MapPin, ChevronRight, Loader2, Search, X } from "lucide-react";
import type { Workstation } from "@/lib/types";
import { API_URL } from "@/lib/config";

interface SiteItem {
  id: string;
  _id?: string;
  name: string;
  detail: string;
  raw?: any;
}

const defaultSites: SiteItem[] = [
  {
    id: "s-1",
    name: "BYD Caroline Springs",
    detail: "Combined · Caroline Springs",
  },
  { id: "s-2", name: "BYD Nunawading", detail: "Combined · Nunawading" },
  { id: "s-3", name: "Denza Melbourne", detail: "Combined · Melbourne" },
  { id: "s-4", name: "Good Showroom", detail: "Combined · Downtown" },
];

export function WorkstationGrid() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Workstation | null>(null);
  const [loginTarget, setLoginTarget] = useState<Workstation | null>(null);

  const [locations, setLocations] = useState<SiteItem[]>(defaultSites);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  useEffect(() => {
    if (selectedRole) {
      setLocationSearchQuery("");
      fetchLocations();
    }
  }, [selectedRole]);

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/locations`, { headers });
      const data = await res.json();

      if (res.ok && data) {
        const rawList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        if (rawList.length > 0) {
          const mapped: SiteItem[] = rawList.map((loc: any) => ({
            id: loc._id || loc.id,
            _id: loc._id || loc.id,
            name: loc.name,
            detail: [loc.type, loc.suburb || loc.address].filter(Boolean).join(" · ") || "Location",
            raw: loc,
          }));
          setLocations(mapped);
        }
      }
    } catch {
      // Fall back to defaultSites if network error
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleCardClick = (workstation: Workstation) => {
    if (workstation.slug === "super-admin") {
      // Open login modal directly for Super Admin
      setLoginTarget(workstation);
    } else {
      // For all other portals: open site selection modal first
      setSelectedRole(workstation);
    }
  };

  const handleSiteSelect = (site: SiteItem) => {
    if (typeof window !== "undefined") {
      const siteData = site.raw || { id: site.id, name: site.name, detail: site.detail };
      localStorage.setItem("selectedLocation", JSON.stringify(siteData));
      localStorage.setItem("selectedSiteId", site._id || site.id);
      localStorage.setItem("selectedSite", site.name);
    }

    const targetWorkstation = selectedRole;
    setSelectedRole(null);

    // Open login modal after location is selected
    if (targetWorkstation) {
      setLoginTarget(targetWorkstation);
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

            {/* Search bar inside modal */}
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 py-2.5 pl-9 pr-9 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
              />
              {locationSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLocationSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {isLoadingLocations ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-neutral-400">
                <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                <p className="text-sm">Loading locations...</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {locations
                  .filter((site) => {
                    if (!locationSearchQuery.trim()) return true;
                    const q = locationSearchQuery.toLowerCase();
                    return (
                      site.name.toLowerCase().includes(q) ||
                      (site.detail && site.detail.toLowerCase().includes(q))
                    );
                  })
                  .map((site) => (
                    <button
                      key={site.id}
                      onClick={() => handleSiteSelect(site)}
                      className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-3.5 text-left transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                          <MapPin className="h-4 w-4 text-neutral-400" />
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
                {locations.filter((site) => {
                  if (!locationSearchQuery.trim()) return true;
                  const q = locationSearchQuery.toLowerCase();
                  return (
                    site.name.toLowerCase().includes(q) ||
                    (site.detail && site.detail.toLowerCase().includes(q))
                  );
                }).length === 0 && (
                  <div className="py-8 text-center text-sm text-neutral-400">
                    <p>No locations matching &ldquo;{locationSearchQuery}&rdquo;</p>
                    <button
                      type="button"
                      onClick={() => setLocationSearchQuery("")}
                      className="mt-1 text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}

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

      {/* Portal Login Modal */}
      <LoginModal
        isOpen={loginTarget !== null}
        onClose={() => setLoginTarget(null)}
        redirectHref={loginTarget?.href ?? "/admin"}
        workstation={loginTarget}
      />
    </section>
  );
}
