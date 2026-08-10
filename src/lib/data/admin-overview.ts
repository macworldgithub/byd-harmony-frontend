import { Users, Car, ClipboardList, MapPin, Radio, UserCog, KeyRound, Building2, Phone, Mail } from "lucide-react";
import type { StatCardData, IntegrationStatus } from "@/lib/types";

export const adminStats: StatCardData[] = [
  { label: "Total Customers", value: "16", helper: "", icon: Users, accent: "red" },
  { label: "Active Vehicles", value: "16", helper: "", icon: Car, accent: "orange" },
  { label: "Open Jobs", value: "16", helper: "", icon: ClipboardList, accent: "green" },
  { label: "Locations", value: "2", helper: "", icon: MapPin, accent: "purple" },
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
  { name: "BYD 2", detail: "Combined · VIC", status: "Active" },
];

export const adminQuickActions = [
  { label: "Manage Locations", icon: MapPin, href: "/admin/locations" },
  { label: "Staff & Roles", icon: UserCog, href: "/admin/staff" },
  { label: "API Keys", icon: KeyRound, href: "/admin/api-keys" },
  { label: "Integrations", icon: Radio, href: "/admin/integrations" },
];

export const adminIconMap = { Building2 };

// ── Locations page data ─────────────────────────────────────────────────────
export const locationCards = [
  {
    id: "loc-1",
    name: "BYD 2",
    address: "main street 123, jasjdajds, VIC",
    phone: "123123123123",
    email: "a@gmail.com",
    capacity: 10,
    type: "Combined" as const,
    status: "Active" as const,
  },
  {
    id: "loc-2",
    name: "BYD Harmony Automotive — Richmond",
    address: "123 Swan Street, Richmond, VIC",
    phone: "0399998888",
    email: null,
    capacity: 20,
    type: "Combined" as const,
    status: "Active" as const,
  },
];

// ── Staff page data ──────────────────────────────────────────────────────────
export const staffMembers = [
  { id: "s-1", name: "Sarah Mitchell", email: "sarah.m@goodshowroom.com.au", role: "Super Admin",  site: "All Sites",         status: "Active" as const },
  { id: "s-2", name: "James Tran",     email: "james.t@goodshowroom.com.au",  role: "Sales",        site: "Richmond",         status: "Active" as const },
  { id: "s-3", name: "Priya Sharma",   email: "priya.s@goodshowroom.com.au",  role: "Service",      site: "Richmond",         status: "Active" as const },
  { id: "s-4", name: "David Lee",      email: "david.l@goodshowroom.com.au",  role: "Delivery Manager", site: "Richmond",    status: "Active" as const },
  { id: "s-5", name: "Emma Wilson",    email: "emma.w@goodshowroom.com.au",   role: "Executive",    site: "All Sites",        status: "Active" as const },
  { id: "s-6", name: "Tom Nguyen",     email: "tom.n@goodshowroom.com.au",    role: "Sales",        site: "BYD 2",           status: "Inactive" as const },
];

// ── API Keys page data ───────────────────────────────────────────────────────
export const apiBaseUrl = "https://goodcrm-2bvrst5w.manus.space/api/v1";

export const apiScopes = [
  {
    id: "scope-sales",
    label: "Sales",
    description: "Customers, vehicles, documents, activity (read/write)",
    color: "blue" as const,
  },
  {
    id: "scope-service",
    label: "Service",
    description: "Vehicles, bookings, jobs, documents, activity (read/write)",
    color: "orange" as const,
  },
  {
    id: "scope-delivery",
    label: "Delivery",
    description: "Vehicles, bookings, documents (read/write)",
    color: "green" as const,
  },
  {
    id: "scope-admin",
    label: "Admin",
    description: "Full access including API key management (read/write)",
    color: "purple" as const,
  },
];

export const phoneIcon = Phone;
export const mailIcon = Mail;
