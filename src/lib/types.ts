import type { LucideIcon } from "lucide-react";

/** Accent color tokens used across role badges, icons and active nav states. */
export type AccentColor =
  | "purple"
  | "green"
  | "blue"
  | "orange"
  | "red";

export interface Workstation {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: AccentColor;
  bullets: string[];
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface RoleConfig {
  slug: string;
  roleLabel: string;
  roleIcon: LucideIcon;
  accent: AccentColor;
  contextLine: string;
  sections: NavSection[];
  /** Shown under the role badge on interior pages that scope to a single site (Site Executive, Service, Delivery, Sales). */
  scopeLine?: string;
}

export interface StatCardData {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent: AccentColor;
  helperAccent?: boolean;
  /** Override the accent-derived value color, e.g. for a neutral "$0" figure. */
  valueClassName?: string;
}

export interface IntegrationStatus {
  name: string;
  detail: string;
  status: "connected" | "configured" | "active";
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

export type JobStatus = "open" | "in_progress" | "awaiting_parts" | "completed";

export interface ServiceJob {
  id: string;
  code: string;
  priority: "normal" | "urgent" | "low";
  detail: string;
  status: JobStatus;
  completeBadge?: boolean;
}

export interface DeliveryItem {
  id: string;
  time: string;
  detail: string;
}

export type LeadStage = "prospect" | "active" | "service";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: LeadStage[];
}
