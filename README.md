# Good Showroom DMS

A pixel-matched recreation of the Good Showroom dealer management system UI, built with Next.js (App Router) and Tailwind CSS.

## Stack

- **Next.js 16** — App Router, React Server Components
- **TypeScript**
- **Tailwind CSS v4**
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/                      # Route segments (App Router)
    page.tsx                # "/" — workstation selector
    admin/                  # Super Admin role
      layout.tsx            # wraps pages with the Super Admin sidebar
      page.tsx              # Platform Overview
    executive/               # Executive role — BI Dashboard
    site-executive/           # Site Executive role — Site Dashboard
    service/                 # Service role — Service Queue (kanban)
    delivery/                 # Delivery Manager role — Delivery Queue
    sales/                    # Sales role — Sales Pipeline (kanban)
    layout.tsx               # root html/body shell
    globals.css               # Tailwind entry + base tokens

  components/
    layout/                  # Sidebar, Logo, RoleBadge, TopBar, DashboardShell, NavListItem
    workstation/              # WorkstationGrid, WorkstationCard (home page cards)
    dashboard/                 # PageHeader, Panel, StatCard variants, IntegrationRow,
                               # LocationCard, QuickActionCard, ChartPlaceholder,
                               # ActivityFeed, Toolbar
    kanban/                    # KanbanColumn, ServiceJobCard, LeadCard
    queue/                     # DeliveryListItem
    ui/                        # Badge, StatusPill — small shared primitives

  lib/
    types.ts                   # shared TypeScript interfaces
    accent.ts                  # static Tailwind class map per accent color (role theming)
    cn.ts                      # classnames merge helper
    data/                      # mock content per page (kept separate from components)
      workstations.ts
      roles.ts                 # per-role sidebar navigation config
      admin-overview.ts
      dashboards.ts             # executive + site-executive dashboard data
      service-jobs.ts
      queues.ts                 # delivery queue + sales pipeline data
```

## Notes on architecture

- Each role (`admin`, `executive`, `site-executive`, `service`, `delivery`, `sales`) is its own
  route segment with a `layout.tsx` that wraps the page in `DashboardShell`, which renders the
  role-specific `Sidebar`.
- `Sidebar` is a **server component**; it pre-renders each nav icon into a JSX element before
  handing it to `NavListItem`, a small **client component** that only needs `usePathname()` for
  active-link styling. This avoids passing icon *functions* across the server/client boundary.
- Role theming (purple/green/blue/orange/red) is centralized in `lib/accent.ts` as static,
  fully-spelled Tailwind classes so Tailwind's JIT compiler can see them at build time.
- Two stat-card visual styles are used across the app and both live in `StatCard.tsx`:
  `IconStatCard` (icon + number, used on the Super Admin overview and delivery stats) and
  `MetricStatCard` (caps label + big colored number, used on Executive / Site Executive
  dashboards), plus `BigStatCard` for the centered large-number cards on the Delivery Queue page.
- All page content is driven by typed mock data in `lib/data/`, so swapping in real API calls
  later just means replacing the data-fetching in each `page.tsx`.

## Build

```bash
npm run build
npm start
```
