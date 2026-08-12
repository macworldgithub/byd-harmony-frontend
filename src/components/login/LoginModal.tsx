"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, X, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectHref: string;
}

export function LoginModal({ isOpen, onClose, redirectHref }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

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
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
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
      if (data.data?.accessToken) localStorage.setItem("accessToken", data.data.accessToken);
      if (data.data?.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);
      if (data.data?.user) localStorage.setItem("user", JSON.stringify(data.data.user));
      onClose();
      router.push(redirectHref);
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="login-modal-title" style={{ animation: "loginModalIn 0.18s ease-out forwards" }} className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #f43f5e)" }} />
        <div className="px-8 pb-8 pt-7">
          <button id="login-modal-close" onClick={onClose} className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700" aria-label="Close login modal">
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 8px 24px rgba(109,40,217,0.25)" }}>
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h2 id="login-modal-title" className="mt-4 text-[22px] font-extrabold tracking-tight text-neutral-900">Super Admin Login</h2>
            <p className="mt-1.5 text-sm text-neutral-500">Sign in with your admin credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">!</span>
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-semibold text-neutral-700">Email address</label>
              <input ref={emailRef} id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@goodshowroom.com" disabled={isLoading} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none disabled:opacity-50" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-semibold text-neutral-700">Password</label>
              <div className="relative">
                <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={isLoading} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none disabled:opacity-50" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button id="login-submit" type="submit" disabled={isLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 4px 14px rgba(109,40,217,0.3)" }}>
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>) : "Sign in to Super Admin"}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes loginModalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
