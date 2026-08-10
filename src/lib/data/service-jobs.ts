import type { ServiceJob } from "@/lib/types";

const codes = [
  "BYD-00016",
  "BYD-00015",
  "BYD-00014",
  "BYD-00013",
  "BYD-00012",
  "BYD-00011",
  "BYD-00010",
  "BYD-00009",
  "BYD-00008",
  "BYD-00007",
  "BYD-00006",
  "BYD-00005",
  "BYD-00004",
  "BYD-00003",
  "BYD-00002",
  "BYD-00001",
];

export const serviceJobs: ServiceJob[] = codes.map((code, i) => ({
  id: String(i + 1),
  code,
  priority: "normal",
  detail: "12,000km routine service",
  status: "in_progress",
  completeBadge: true,
}));

export const serviceColumns = [
  { key: "open", label: "Open", accent: "blue" as const },
  { key: "in_progress", label: "In Progress", accent: "orange" as const },
  { key: "awaiting_parts", label: "Awaiting Parts", accent: "orange" as const },
  { key: "completed", label: "Completed", accent: "green" as const },
];
