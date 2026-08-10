import { Users, Car, ClipboardList, MapPin, Radio, UserCog, KeyRound, Building2 } from "lucide-react";
import type { StatCardData, IntegrationStatus } from "@/lib/types";

export const adminStats: StatCardData[] = [
  { label: "Total Customers", value: "16", helper: "", icon: Users, accent: "red" },
  { label: "Active Vehicles", value: "16", helper: "", icon: Car, accent: "orange" },
  { label: "Open Jobs", value: "16", helper: "", icon: ClipboardList, accent: "green" },
  { label: "Locations", value: "1", helper: "", icon: MapPin, accent: "purple" },
];

export const integrationHealth: IntegrationStatus[] = [
  { name: "Mobile Message SMS", detail: "+61 427 580 838", status: "connected" },
  { name: "SMTP Email", detail: "Nodemailer", status: "configured" },
  { name: "AI / LLM", detail: "Built-in Forge API", status: "connected" },
  { name: "S3 Storage", detail: "Manus Storage", status: "connected" },
  { name: "REST API v1", detail: "/api/v1/", status: "active" },
];

export const adminLocations = [
  { name: "BYD Harmony Automotive — Richmond", detail: "Combined · Richmond", status: "Active" },
];

export const adminQuickActions = [
  { label: "Manage Locations", icon: MapPin, href: "/admin/locations" },
  { label: "Staff & Roles", icon: UserCog, href: "/admin/staff" },
  { label: "API Keys", icon: KeyRound, href: "/admin/api-keys" },
  { label: "Integrations", icon: Radio, href: "/admin/integrations" },
];

export const adminIconMap = { Building2 };
