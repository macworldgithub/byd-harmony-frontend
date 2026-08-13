"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerIcon?: ReactNode;
  maxWidth?: string;
  disableBackdropClose?: boolean;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerIcon,
  maxWidth = "max-w-lg",
  disableBackdropClose = false,
  footer,
  className = "",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
        onClick={disableBackdropClose ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ animation: "modalIn 0.18s ease-out forwards" }}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200 flex flex-col ${className}`}
      >
        <div
          className="h-1.5 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #f43f5e)" }}
        />

        <div className="relative flex items-start gap-3 px-6 pt-5 pb-3 shrink-0">
          {headerIcon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              {headerIcon}
            </div>
          )}
          <div className="min-w-0 flex-1 pr-8">
            <h2 id="modal-title" className="text-lg font-extrabold tracking-tight text-neutral-900">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>

        {footer && <div className="shrink-0 border-t border-neutral-100 px-6 py-4">{footer}</div>}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}