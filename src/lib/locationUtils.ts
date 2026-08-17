/**
 * Utility to get the currently selected Site Executive location ID.
 * Priority: URL ?site= param → localStorage selectedSiteId → selectedLocation object
 */
export function getCurrentLocationId(searchParams?: URLSearchParams | null): string {
  if (typeof window === "undefined") return "";

  if (searchParams) {
    const urlSite = searchParams.get("site");
    if (urlSite) return urlSite;
  } else {
    try {
      const url = new URL(window.location.href);
      const urlSite = url.searchParams.get("site");
      if (urlSite) return urlSite;
    } catch {}
  }

  const stored = localStorage.getItem("selectedSiteId");
  if (stored) return stored;

  const savedLocStr = localStorage.getItem("selectedLocation");
  if (savedLocStr) {
    try {
      const parsed = JSON.parse(savedLocStr);
      return parsed._id || parsed.id || "";
    } catch {}
  }
  return "";
}

export function getCurrentSiteName(): string {
  if (typeof window === "undefined") return "";
  const name = localStorage.getItem("selectedSite");
  if (name) return name;
  const savedLocStr = localStorage.getItem("selectedLocation");
  if (savedLocStr) {
    try {
      const parsed = JSON.parse(savedLocStr);
      return parsed.name || "";
    } catch {}
  }
  return "";
}
