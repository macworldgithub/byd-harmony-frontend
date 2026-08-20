"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, X, Loader2, MapPin } from "lucide-react";
import type { Workstation } from "@/lib/types";
import { API_URL } from "@/lib/config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectHref: string;
  workstation?: Workstation | null;
}

export function LoginModal({
  isOpen,
  onClose,
  redirectHref,
  workstation,
}: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const isSuperAdmin = !workstation || workstation.slug === "super-admin";
  const selectedSiteName =
    typeof window !== "undefined" ? localStorage.getItem("selectedSite") || "" : "";

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError(null);
      setShowPassword(false);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      const responseData = data.data || data;
      const user = responseData.user;
      const token = responseData.accessToken;

      const userRole = (user?.role || "").toLowerCase();
      const isSuperAdminRole =
        userRole === "super_admin" ||
        userRole === "admin" ||
        userRole === "superadmin" ||
        userRole === "super-admin";

      /* ── Rule 1: Super Admin Portal Role Verification ───────────── */
      if (isSuperAdmin) {
        if (!isSuperAdminRole) {
          setError(
            "Access Denied: Only Super Admin credentials are allowed for this portal."
          );
          setIsLoading(false);
          return;
        }
      }

      /* ── Rule 2: Strict Location Verification for Location Portals ─── */
      if (!isSuperAdmin) {
        let storedLocationId =
          typeof window !== "undefined" ? localStorage.getItem("selectedSiteId") || "" : "";

        if (!storedLocationId && typeof window !== "undefined") {
          const savedLocStr = localStorage.getItem("selectedLocation");
          if (savedLocStr) {
            try {
              const parsed = JSON.parse(savedLocStr);
              storedLocationId = parsed._id || parsed.id || "";
            } catch {}
          }
        }

        // Extract locationId from user object or JWT token
        let userLocationId: string | null = null;

        const checkLoc = (val: any): string | null => {
          if (!val) return null;
          if (typeof val === "string" && val.trim()) return val.trim();
          if (typeof val === "object") {
            const id = val._id || val.id;
            if (id && typeof id === "string") return id.trim();
          }
          return null;
        };

        if (user) {
          userLocationId =
            checkLoc(user.locationId) ||
            checkLoc(user.location_id) ||
            checkLoc(user.location) ||
            checkLoc(user.preferredLocationId) ||
            checkLoc(user.siteId) ||
            checkLoc(user.site_id) ||
            checkLoc(user.site);
        }

        // Fallback to token payload if not found on user object
        if (!userLocationId && token && typeof token === "string") {
          try {
            const parts = token.split(".");
            if (parts.length === 3) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                  .join("")
              );
              const payload = JSON.parse(jsonPayload);
              userLocationId =
                checkLoc(payload.locationId) ||
                checkLoc(payload.location_id) ||
                checkLoc(payload.location) ||
                checkLoc(payload.preferredLocationId) ||
                checkLoc(payload.siteId) ||
                checkLoc(payload.site_id) ||
                checkLoc(payload.site) ||
                (payload.user
                  ? checkLoc(
                      payload.user.locationId ||
                        payload.user.location ||
                        payload.user.preferredLocationId ||
                        payload.user.siteId
                    )
                  : null);
            }
          } catch {}
        }

        if (!storedLocationId) {
          setError("Please select a location first.");
          setIsLoading(false);
          return;
        }

        if (!userLocationId) {
          setError(
            "Access Denied: No assigned location found on this account."
          );
          setIsLoading(false);
          return;
        }

        if (String(userLocationId) !== String(storedLocationId)) {
          setError(
            "Access Denied: Your account location does not match the selected site."
          );
          setIsLoading(false);
          return;
        }
      }

      // Save Auth Tokens & User Info
      if (responseData.accessToken) localStorage.setItem("accessToken", responseData.accessToken);
      if (responseData.refreshToken) localStorage.setItem("refreshToken", responseData.refreshToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      onClose();
      router.push(redirectHref);
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const titleText = isSuperAdmin
    ? "Super Admin Login"
    : `${workstation?.name || "Workstation"} Login`;

  const subtitleText = isSuperAdmin
    ? "Sign in with your admin credentials to continue"
    : selectedSiteName
    ? `Sign in to access ${selectedSiteName}`
    : "Sign in with your credentials to access this workstation";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        style={{ animation: "loginModalIn 0.18s ease-out forwards" }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200"
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: isSuperAdmin
              ? "linear-gradient(90deg, #7c3aed, #a855f7, #f43f5e)"
              : "linear-gradient(90deg, #e11d48, #f43f5e, #fb7185)",
          }}
        />
        <div className="px-8 pb-8 pt-7">
          <button
            id="login-modal-close"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close login modal"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: isSuperAdmin
                  ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                  : "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                boxShadow: isSuperAdmin
                  ? "0 8px 24px rgba(109,40,217,0.25)"
                  : "0 8px 24px rgba(225,29,72,0.25)",
              }}
            >
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h2
              id="login-modal-title"
              className="mt-4 text-[22px] font-extrabold tracking-tight text-neutral-900"
            >
              {titleText}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">{subtitleText}</p>

            {!isSuperAdmin && selectedSiteName && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                <span>Selected Site: {selectedSiteName}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  !
                </span>
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-neutral-700"
              >
                Email address
              </label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@goodshowroom.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-neutral-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isSuperAdmin
                  ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                  : "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                boxShadow: isSuperAdmin
                  ? "0 4px 14px rgba(109,40,217,0.3)"
                  : "0 4px 14px rgba(225,29,72,0.3)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in to ${workstation?.name || "Workstation"}`
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes loginModalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
