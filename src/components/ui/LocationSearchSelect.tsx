"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, MapPin, ChevronDown, Check, X, Loader2 } from "lucide-react";

export interface LocationOption {
  _id?: string;
  id?: string;
  name: string;
  suburb?: string;
  state?: string;
  address?: string;
  city?: string;
  type?: string;
  [key: string]: any;
}

export interface LocationSearchSelectProps {
  locations: LocationOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  allowClear?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export function LocationSearchSelect({
  locations = [],
  value = "",
  onChange,
  placeholder = "Select location",
  emptyLabel,
  allowClear = false,
  disabled = false,
  loading = false,
  loadingText = "Loading locations...",
  required = false,
  id,
  className = "",
}: LocationSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract id from a location item
  const getId = (loc: LocationOption): string => {
    return loc._id || loc.id || "";
  };

  // Find currently selected location object
  const selectedLocation = useMemo(() => {
    if (!value) return null;
    return locations.find((loc) => getId(loc) === value || loc.name === value) || null;
  }, [locations, value]);

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.toLowerCase().trim();
    return locations.filter((loc) => {
      const name = (loc.name || "").toLowerCase();
      const suburb = (loc.suburb || "").toLowerCase();
      const address = (loc.address || "").toLowerCase();
      const city = (loc.city || "").toLowerCase();
      const state = (loc.state || "").toLowerCase();
      const type = (loc.type || "").toLowerCase();
      return (
        name.includes(q) ||
        suburb.includes(q) ||
        address.includes(q) ||
        city.includes(q) ||
        state.includes(q) ||
        type.includes(q)
      );
    });
  }, [locations, searchQuery]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (locId: string) => {
    onChange(locId);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const displayLabel = useMemo(() => {
    if (selectedLocation) {
      const sub = selectedLocation.suburb || selectedLocation.city || "";
      return selectedLocation.name + (sub ? ` (${sub})` : "");
    }
    if (value) {
      return value;
    }
    return emptyLabel || placeholder;
  }, [selectedLocation, value, emptyLabel, placeholder]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between rounded-xl border bg-neutral-50 px-3.5 py-2.5 text-left text-sm transition-all focus:outline-none focus:ring-4 ${
          disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
            : isOpen
            ? "border-violet-500 bg-white ring-4 ring-violet-500/10 text-neutral-900"
            : "border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50/80 focus:border-violet-500 focus:bg-white focus:ring-violet-500/10"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <MapPin
            className={`h-4 w-4 shrink-0 transition-colors ${
              selectedLocation ? "text-violet-600" : "text-neutral-400"
            }`}
          />
          <span
            className={`truncate ${
              !selectedLocation && !value ? "text-neutral-500" : "font-medium text-neutral-900"
            }`}
          >
            {loading ? loadingText : displayLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          ) : (
            <>
              {allowClear && value && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onChange("");
                    }
                  }}
                  className="rounded-full p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors"
                  title="Clear location"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-violet-600" : ""
                }`}
              />
            </>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search bar inside dropdown */}
          <div className="relative p-1.5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location by name, suburb, city..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/80 py-2 pl-9 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="mt-1 max-h-60 overflow-y-auto space-y-0.5 px-1 py-1">
            {/* Optional / Empty option */}
            {(emptyLabel || allowClear || !required) && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                  !value
                    ? "bg-violet-50 font-semibold text-violet-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <span className="italic">{emptyLabel || "No location restriction"}</span>
                {!value && <Check className="h-3.5 w-3.5 text-violet-600 shrink-0" />}
              </button>
            )}

            {filteredLocations.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                {searchQuery ? (
                  <>
                    <p>No locations matching &ldquo;{searchQuery}&rdquo;</p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-1.5 font-medium text-violet-600 hover:underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <p>No locations available</p>
                )}
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const id = getId(loc);
                const isSelected = value === id || (Boolean(value) && value === loc.name);
                const suburb = loc.suburb || loc.city || "";
                const state = loc.state || "";
                const locationType = loc.type || "";

                return (
                  <button
                    key={id || loc.name}
                    type="button"
                    onClick={() => handleSelect(id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-violet-50 font-semibold text-violet-900"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                          isSelected
                            ? "bg-violet-600 text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-medium">{loc.name}</div>
                        {(suburb || state || locationType) && (
                          <div className="text-[11px] text-neutral-400 truncate">
                            {[locationType, suburb, state].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-violet-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
