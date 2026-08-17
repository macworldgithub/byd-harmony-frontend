import {
  Shield,
  TrendingUp,
  Building2,
  Wrench,
  Truck,
  ShoppingCart,
  LayoutGrid,
  MapPin,
  Users,
  KeyRound,
  Car,
  ClipboardList,
  FileText,
  Radio,
  BookOpen,
  Settings,
  BarChart3,
  Layers,
  Calendar,
  Package,
  UserCog,
  ClipboardCheck,
  MessageSquare,
  Bell,
  Send,
  Star,
  Activity,
} from "lucide-react";
import type { RoleConfig } from "@/lib/types";

export const roles: Record<string, RoleConfig> = {
  operations: {
    slug: "operations",
    roleLabel: "Operations",
    roleIcon: Activity,
    accent: "red",
    contextLine: "All Sites — BYD Harmony",
    scopeLine: "BYD Harmony Automotive ...",
    sections: [
      {
        title: "Operations",
        links: [
          { label: "Dashboard", href: "/operations", icon: LayoutGrid },
          { label: "Customers", href: "/operations/customers", icon: Users },
          {
            label: "Service Bookings",
            href: "/operations/bookings",
            icon: Calendar,
          },
          {
            label: "Job Cards",
            href: "/operations/job-cards",
            icon: ClipboardList,
          },
          { label: "Documents", href: "/operations/documents", icon: FileText },
          { label: "Locations", href: "/operations/locations", icon: MapPin },
        ],
      },
      {
        title: "System",
        links: [
          {
            label: "Executive",
            href: "/operations/executive",
            icon: TrendingUp,
          },
          { label: "Live Comms", href: "/operations/live-comms", icon: Radio },
          { label: "API Keys", href: "/operations/api-keys", icon: KeyRound },
          { label: "API Docs", href: "/operations/api-docs", icon: BookOpen },
          { label: "Settings", href: "/operations/settings", icon: Settings },
        ],
      },
    ],
  },

  admin: {
    slug: "admin",
    roleLabel: "Super Admin",
    roleIcon: Shield,
    accent: "purple",
    contextLine: "Good Showroom DMS · BYD Harmony Automotive · Super Admin",
    sections: [
      {
        title: "Platform",
        links: [
          { label: "Overview", href: "/admin", icon: LayoutGrid },
          { label: "Locations", href: "/admin/locations", icon: MapPin },
          { label: "Staff & Roles", href: "/admin/staff", icon: Users },
          { label: "API Keys", href: "/admin/api-keys", icon: KeyRound },
        ],
      },
      {
        title: "Data",
        links: [
          { label: "All Customers", href: "/admin/customers", icon: Users },
          { label: "All Vehicles", href: "/admin/vehicles", icon: Car },
          {
            label: "All Job Cards",
            href: "/admin/job-cards",
            icon: ClipboardList,
          },
          { label: "Documents", href: "/admin/documents", icon: FileText },
        ],
      },
      {
        title: "System",
        links: [
          { label: "Integrations", href: "/admin/integrations", icon: Radio },
          { label: "Audit Log", href: "/admin/audit-log", icon: Shield },
          { label: "API Docs", href: "/admin/api-docs", icon: BookOpen },
          { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
      },
    ],
  },

  executive: {
    slug: "executive",
    roleLabel: "Executive",
    roleIcon: TrendingUp,
    accent: "green",
    contextLine:
      "Cross-site performance · All departments · Live data · Monday 10 August 2026",
    sections: [
      {
        title: "Intelligence",
        links: [
          { label: "BI Dashboard", href: "/executive", icon: BarChart3 },
          {
            label: "Custom Screen",
            href: "/executive/custom-screen",
            icon: Layers,
          },
          {
            label: "Site Comparison",
            href: "/executive/site-comparison",
            icon: Building2,
          },
        ],
      },
      {
        title: "Operations",
        links: [
          { label: "Customers", href: "/executive/customers", icon: Users },
          {
            label: "Job Cards",
            href: "/executive/job-cards",
            icon: ClipboardList,
          },
          { label: "Bookings", href: "/executive/bookings", icon: Calendar },
        ],
      },
      {
        title: "Reports",
        links: [
          { label: "Revenue", href: "/executive/revenue", icon: TrendingUp },
          {
            label: "Activity Feed",
            href: "/executive/activity-feed",
            icon: Radio,
          },
        ],
      },
    ],
  },

  "site-executive": {
    slug: "site-executive",
    roleLabel: "Site Executive",
    roleIcon: Building2,
    accent: "blue",
    contextLine: "Monday 10 August 2026",
    scopeLine: "BYD Harmony Automotive ...",
    sections: [
      {
        title: "Site Dashboard",
        links: [
          { label: "Dashboard", href: "/site-executive", icon: LayoutGrid },
          {
            label: "Reports",
            href: "/site-executive/reports",
            icon: BarChart3,
          },
          {
            label: "Live Activity",
            href: "/site-executive/live-activity",
            icon: Radio,
          },
        ],
      },
      {
        title: "Operations",
        links: [
          {
            label: "Customers",
            href: "/site-executive/customers",
            icon: Users,
          },
          {
            label: "Bookings",
            href: "/site-executive/bookings",
            icon: Calendar,
          },
          {
            label: "Job Cards",
            href: "/site-executive/job-cards",
            icon: ClipboardList,
          },
          {
            label: "Inventory",
            href: "/site-executive/inventory",
            icon: Package,
          },
        ],
      },
      {
        title: "Management",
        links: [
          { label: "Staff", href: "/site-executive/staff", icon: UserCog },
          {
            label: "Documents",
            href: "/site-executive/documents",
            icon: FileText,
          },
        ],
      },
    ],
  },

  service: {
    slug: "service",
    roleLabel: "Service",
    roleIcon: Wrench,
    accent: "orange",
    contextLine: "",
    scopeLine: "BYD Harmony Automotive ...",
    sections: [
      {
        title: "Workshop",
        links: [
          { label: "Service Queue", href: "/service", icon: ClipboardCheck },
          {
            label: "Booking Calendar",
            href: "/service/booking-calendar",
            icon: Calendar,
          },
          {
            label: "Repair Orders",
            href: "/service/repair-orders",
            icon: ClipboardList,
          },
        ],
      },
      {
        title: "Customers",
        links: [
          { label: "Customers", href: "/service/customers", icon: Users },
          { label: "Vehicles", href: "/service/vehicles", icon: Car },
          {
            label: "Communications",
            href: "/service/communications",
            icon: MessageSquare,
          },
        ],
      },
      {
        title: "Workshop Mgmt",
        links: [
          { label: "Technicians", href: "/service/technicians", icon: Wrench },
          {
            label: "Parts & Inventory",
            href: "/service/parts-inventory",
            icon: Package,
          },
          { label: "Documents", href: "/service/documents", icon: FileText },
        ],
      },
    ],
  },

  delivery: {
    slug: "delivery",
    roleLabel: "Delivery Manager",
    roleIcon: Truck,
    accent: "green",
    contextLine: "",
    scopeLine: "BYD Harmony Automotive ...",
    sections: [
      {
        title: "Deliveries",
        links: [
          { label: "Delivery Queue", href: "/delivery", icon: Truck },
          // {
          //   label: "Delivery Calendar",
          //   href: "/delivery/calendar",
          //   icon: Calendar,
          // },
          {
            label: "Delivery Orders",
            href: "/delivery/orders",
            icon: ClipboardList,
          },
        ],
      },
      {
        title: "Customers",
        links: [
          { label: "Customers", href: "/delivery/customers", icon: Users },
          { label: "Vehicles", href: "/delivery/vehicles", icon: Car },
          {
            label: "Communications",
            href: "/delivery/communications",
            icon: MessageSquare,
          },
        ],
      },
      {
        title: "Operations",
        links: [
          {
            label: "Contractors",
            href: "/delivery/contractors",
            icon: UserCog,
          },
          {
            label: "Checklists",
            href: "/delivery/checklists",
            icon: ClipboardCheck,
          },
          { label: "Documents", href: "/delivery/documents", icon: FileText },
        ],
      },
    ],
  },

  sales: {
    slug: "sales",
    roleLabel: "Sales",
    roleIcon: ShoppingCart,
    accent: "red",
    contextLine: "",
    scopeLine: "",
    sections: [
      {
        title: "Pipeline",
        links: [
          { label: "Pipeline", href: "/sales", icon: LayoutGrid },
          { label: "Customers", href: "/sales/customers", icon: Users },
          { label: "Reminders", href: "/sales/reminders", icon: Bell },
        ],
      },
      {
        title: "Communications",
        links: [
          { label: "Comms Hub", href: "/sales/comms-hub", icon: MessageSquare },
          { label: "Templates", href: "/sales/templates", icon: Send },
          { label: "Campaigns", href: "/sales/campaigns", icon: Star },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Vehicles", href: "/sales/vehicles", icon: Car },
          { label: "Documents", href: "/sales/documents", icon: FileText },
        ],
      },
    ],
  },
};
