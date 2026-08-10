import { Shield, TrendingUp, Building2, Wrench, Truck, ShoppingCart } from "lucide-react";
import type { Workstation } from "@/lib/types";

export const workstations: Workstation[] = [
  {
    slug: "super-admin",
    name: "Super Admin",
    description: "Full platform control across all sites",
    icon: Shield,
    accent: "purple",
    href: "/admin",
    bullets: [
      "Platform settings & configuration",
      "All locations & staff management",
      "API keys & integrations",
      "System health & audit logs",
    ],
  },
  {
    slug: "executive",
    name: "Executive",
    description: "Business intelligence across all departments and sites",
    icon: TrendingUp,
    accent: "green",
    href: "/executive",
    bullets: [
      "Business intelligence dashboard",
      "Cross-site performance metrics",
      "Custom metric screens",
      "Drill-down to any site or dept",
    ],
  },
  {
    slug: "site-executive",
    name: "Site Executive",
    description: "Site performance dashboard, inventory, and staff management",
    icon: Building2,
    accent: "blue",
    href: "/site-executive",
    bullets: [
      "Site performance dashboard",
      "Daily & monthly reports",
      "Inventory & staff management",
      "Department drill-down",
    ],
  },
  {
    slug: "service",
    name: "Service",
    description: "Repair orders, technicians, bookings, and customer vehicles",
    icon: Wrench,
    accent: "orange",
    href: "/service",
    bullets: [
      "Repair order management",
      "Technician scheduling",
      "Service bookings & calendar",
      "Parts & customer vehicle history",
    ],
  },
  {
    slug: "delivery-manager",
    name: "Delivery Manager",
    description: "Delivery calendar, pre/post delivery, and contractors",
    icon: Truck,
    accent: "green",
    href: "/delivery",
    bullets: [
      "Delivery calendar & schedule",
      "Pre/post delivery checklists",
      "Contractor management",
      "Customer delivery communications",
    ],
  },
  {
    slug: "sales",
    name: "Sales",
    description: "Prospect pipeline, lifecycle management, and communications",
    icon: ShoppingCart,
    accent: "red",
    href: "/sales",
    bullets: [
      "Prospect pipeline & lifecycle",
      "AI-assisted communications",
      "Template quick-send",
      "Follow-up reminders",
    ],
  },
];
