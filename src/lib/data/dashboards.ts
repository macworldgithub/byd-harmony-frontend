import { Users, Car, Calendar, ClipboardList } from "lucide-react";
import type { StatCardData, ActivityItem } from "@/lib/types";

export const executiveStats: StatCardData[] = [
  { label: "Total Customers", value: "16", helper: "Trending up", icon: Users, accent: "red", helperAccent: true },
  { label: "Active Vehicles", value: "16", helper: "In fleet", icon: Car, accent: "orange" },
  { label: "Bookings Today", value: "16", helper: "Across all sites", icon: Calendar, accent: "green" },
  { label: "Open Jobs", value: "16", helper: "In workshop", icon: ClipboardList, accent: "purple" },
];

export const siteExecutiveStats: StatCardData[] = [
  { label: "Open Jobs", value: "16", helper: "At this site", icon: ClipboardList, accent: "red" },
  { label: "Upcoming Bookings", value: "17", helper: "Scheduled", icon: Calendar, accent: "green" },
  { label: "Utilisation", value: "80%", helper: "of 20 capacity", icon: Car, accent: "orange" },
  { label: "Revenue", value: "$0", helper: "Completed jobs", icon: Users, accent: "purple", valueClassName: "text-neutral-900" },
];

export const recentActivity: ActivityItem[] = [
  { id: "1", message: "Booking status updated to: confirmed", timestamp: "11:03 pm" },
  { id: "2", message: "Booking status updated to: confirmed", timestamp: "11:03 pm" },
  { id: "3", message: "Service booking created for 07/08/2026 — pre_delivery", timestamp: "11:03 pm" },
  { id: "4", message: "Customer called to confirm service appointment", timestamp: "03:07 am" },
  { id: "5", message: "Job BYD-00016 status: in_progress", timestamp: "03:07 am" },
  { id: "6", message: "Job card BYD-00016 created — normal priority", timestamp: "03:07 am" },
  { id: "7", message: "Booking status updated to: confirmed", timestamp: "03:07 am" },
];

export const locationPerformance = {
  name: "BYD Harmony Automotive — Richmond",
  detail: "Combined · Richmond",
  utilisation: 80,
  openJobs: 16,
  upcomingBookings: 17,
  revenue: "$0",
};

export const responseTimeMetrics = [
  { label: "Avg Response", value: "0m", accent: "text-neutral-900" },
  { label: "Fastest", value: "0m", accent: "text-emerald-600" },
  { label: "Slowest", value: "0m", accent: "text-amber-600" },
  { label: "Total Responses", value: "0", accent: "text-neutral-900" },
];
