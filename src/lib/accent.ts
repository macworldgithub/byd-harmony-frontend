import type { AccentColor } from "./types";

interface AccentClasses {
  /** soft icon tile background */
  iconBg: string;
  iconText: string;
  /** role badge */
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  /** active sidebar nav item */
  navActiveBg: string;
  navActiveText: string;
  /** value text for stat numbers */
  valueText: string;
  /** progress bar fill */
  barFill: string;
  /** solid button */
  buttonBg: string;
  buttonBgHover: string;
  /** left rule accent on kanban columns */
  ring: string;
}

export const accentMap: Record<AccentColor, AccentClasses> = {
  purple: {
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-200",
    navActiveBg: "bg-violet-50",
    navActiveText: "text-violet-700",
    valueText: "text-violet-600",
    barFill: "bg-violet-500",
    buttonBg: "bg-violet-600",
    buttonBgHover: "hover:bg-violet-700",
    ring: "before:bg-violet-500",
  },
  green: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    navActiveBg: "bg-emerald-50",
    navActiveText: "text-emerald-700",
    valueText: "text-emerald-600",
    barFill: "bg-emerald-500",
    buttonBg: "bg-emerald-600",
    buttonBgHover: "hover:bg-emerald-700",
    ring: "before:bg-emerald-500",
  },
  blue: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    navActiveBg: "bg-blue-50",
    navActiveText: "text-blue-700",
    valueText: "text-neutral-900",
    barFill: "bg-blue-500",
    buttonBg: "bg-blue-600",
    buttonBgHover: "hover:bg-blue-700",
    ring: "before:bg-blue-500",
  },
  orange: {
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    navActiveBg: "bg-amber-50",
    navActiveText: "text-amber-700",
    valueText: "text-amber-600",
    barFill: "bg-amber-500",
    buttonBg: "bg-amber-600",
    buttonBgHover: "hover:bg-amber-700",
    ring: "before:bg-amber-500",
  },
  red: {
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200",
    navActiveBg: "bg-rose-50",
    navActiveText: "text-rose-700",
    valueText: "text-rose-600",
    barFill: "bg-rose-500",
    buttonBg: "bg-rose-600",
    buttonBgHover: "hover:bg-rose-700",
    ring: "before:bg-rose-500",
  },
};
