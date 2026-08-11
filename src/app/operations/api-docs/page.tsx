"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Shield,
  KeyRound,
  Users,
  Car,
  Calendar,
  ClipboardList,
  FileText,
  MapPin,
  TrendingUp,
  Activity,
  Radio,
  Key,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Lock,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "authentication", label: "Authentication", icon: Shield },
  { id: "roles-scopes", label: "Roles & Scopes", icon: KeyRound },
  { id: "customers", label: "Customers", icon: Users },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "service-bookings", label: "Service Bookings", icon: Calendar },
  { id: "job-cards", label: "Job Cards", icon: ClipboardList },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "stats-analytics", label: "Stats & Analytics", icon: TrendingUp },
  { id: "activity-thread", label: "Activity Thread", icon: Activity },
  { id: "webhooks", label: "Webhooks", icon: Radio },
  { id: "key-management", label: "Key Management", icon: Key },
];

export default function OperationsApiDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      {/* Inner sticky sidebar navigation */}
      <div className="hidden lg:block w-60 shrink-0 pr-4">
        <div className="sticky top-6">
          <div className="text-[11px] font-bold tracking-widest text-neutral-400 mb-3 uppercase">
            API Reference
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all text-left ${isActive
                      ? "bg-rose-50/80 text-rose-600 font-semibold shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900"
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-rose-600" : "text-neutral-400"
                      }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-neutral-200/60">
            <Link
              href="/operations/api-keys"
              className="flex items-center justify-between w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
            >
              <span>Manage API Keys</span>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main documentation content */}
      <div className="flex-1 max-w-4xl min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
          <Link
            href="/operations/api-keys"
            className="hover:text-neutral-800 transition-colors"
          >
            API Keys
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <span className="font-medium text-neutral-800">Documentation</span>
        </div>

        {/* Page Title & Badges */}
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Good Showroom DMS API
        </h1>
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          REST API v1 — Build role-based applications, integrations, and
          automations on top of the BYD Harmony Group Dealership Management System.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
            V1.0 STABLE
          </span>
          <code className="rounded-lg bg-neutral-100 border border-neutral-200/80 px-3 py-1 text-xs font-mono text-neutral-700">
            https://goodcrm-2bvrst5w.manus.space/api/v1
          </code>
        </div>

        {/* Overview Section */}
        <section id="overview" className="scroll-mt-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
              <Shield className="h-6 w-6 text-rose-600 mb-3" />
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                API Key Auth
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Bearer token authentication with role-based access control
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
              <Radio className="h-6 w-6 text-rose-600 mb-3" />
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Webhooks
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Real-time event delivery with HMAC-SHA256 signature verification
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm">
              <KeyRound className="h-6 w-6 text-rose-600 mb-3" />
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Role-Based
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                7 roles: readonly, sales, service, delivery, finance, executive, admin
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#0f172a] text-slate-200 p-5 font-mono text-xs shadow-lg overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-[11px] text-slate-400 font-sans ml-2">bash</span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl https://goodcrm-2bvrst5w.manus.space/api/v1/health`,
                    "overview"
                  )
                }
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === "overview" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedId === "overview" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="overflow-x-auto leading-relaxed">
              <span className="text-slate-500"># Health check — no auth required</span>
              {"\n"}
              <span className="text-sky-400">curl</span> https://goodcrm-2bvrst5w.manus.space/api/v1/health
              {"\n\n"}
              <span className="text-slate-500"># Response</span>
              {"\n"}
              {`{
  "ok": true,
  "service": "Good Showroom DMS",
  "version": "1.0",
  "timestamp": "2026-08-05T00:00:00.000Z"
}`}
            </pre>
          </div>
        </section>

        {/* Authentication Section */}
        <section id="authentication" className="scroll-mt-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-3">
            Authentication
          </h2>
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            All API requests (except <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">/api/v1/health</code>) require a Bearer token in the Authorization header. Keys are prefixed <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">gs_live_</code> and are generated from the API Keys page.
          </p>

          <div className="relative rounded-2xl bg-[#0f172a] text-slate-200 p-5 font-mono text-xs shadow-lg overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-[11px] text-slate-400 font-sans ml-2">bash</span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl https://goodcrm-2bvrst5w.manus.space/api/v1/customers \\\n  -H "Authorization: Bearer gs_live_your_key_here"`,
                    "auth"
                  )
                }
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === "auth" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedId === "auth" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="overflow-x-auto leading-relaxed">
              <span className="text-slate-500"># Include in every request</span>
              {"\n"}
              <span className="text-sky-400">curl</span> https://goodcrm-2bvrst5w.manus.space/api/v1/customers \{"\n"}  -H <span className="text-emerald-300">"Authorization: Bearer gs_live_your_key_here"</span>
              {"\n\n"}
              <span className="text-slate-500"># Error response (401 Unauthorized)</span>
              {"\n"}
              {`{
  "ok": false,
  "error": "Invalid or revoked API key"
}`}
            </pre>
          </div>
        </section>

        {/* Roles & Scopes Section */}
        <section id="roles-scopes" className="scroll-mt-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-3">
            Roles & Scopes
          </h2>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70 font-semibold text-neutral-600">
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Access</th>
                  <th className="px-5 py-3">Write</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">readonly</td>
                  <td className="px-5 py-3 text-neutral-600">All scoped resources</td>
                  <td className="px-5 py-3 text-neutral-400">—</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">sales</td>
                  <td className="px-5 py-3 text-neutral-600">customers, vehicles, documents, activity</td>
                  <td className="px-5 py-3 text-neutral-600">customers, documents, activity</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">service</td>
                  <td className="px-5 py-3 text-neutral-600">vehicles, bookings, jobs, documents, activity</td>
                  <td className="px-5 py-3 text-neutral-600">bookings, jobs, documents, activity</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">delivery</td>
                  <td className="px-5 py-3 text-neutral-600">vehicles, bookings, documents</td>
                  <td className="px-5 py-3 text-neutral-600">bookings, documents</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">finance</td>
                  <td className="px-5 py-3 text-neutral-600">jobs, documents, stats</td>
                  <td className="px-5 py-3 text-neutral-600">jobs, documents</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">executive</td>
                  <td className="px-5 py-3 text-neutral-600">All resources (read), stats, activity</td>
                  <td className="px-5 py-3 text-neutral-400">—</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-semibold text-neutral-900 font-sans">admin</td>
                  <td className="px-5 py-3 text-neutral-600">Full access + key management</td>
                  <td className="px-5 py-3 text-neutral-600">Full access + key management</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Scopes further restrict which resources a key can access, regardless of role. Available scopes: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">customers</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">vehicles</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">bookings</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">jobs</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">documents</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">locations</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">activity</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">stats</code>.
          </p>
        </section>

        {/* Customers Section */}
        <section id="customers" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Customers</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: customers
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/customers</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List all customers (Query: search, stage, limit, offset)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/customers/:id</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Get a single customer by ID</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">POST</span>
              <code className="font-mono text-neutral-800">/api/v1/customers</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Create a new customer</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">PATCH</span>
              <code className="font-mono text-neutral-800">/api/v1/customers/:id</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Update customer fields</span>
            </div>
          </div>
        </section>

        {/* Vehicles Section */}
        <section id="vehicles" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Vehicles</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: vehicles
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/vehicles</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List vehicles (Query: customerId, status, limit)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/vehicles/:id</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Get a single vehicle by ID</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">POST</span>
              <code className="font-mono text-neutral-800">/api/v1/vehicles</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Add a vehicle</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">PATCH</span>
              <code className="font-mono text-neutral-800">/api/v1/vehicles/:id</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Update vehicle</span>
            </div>
          </div>
        </section>

        {/* Service Bookings Section */}
        <section id="service-bookings" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Service Bookings</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: bookings
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/bookings</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List bookings (Query: locationId, status, from, to)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">POST</span>
              <code className="font-mono text-neutral-800">/api/v1/bookings</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Create a service booking</span>
            </div>
          </div>
        </section>

        {/* Job Cards Section */}
        <section id="job-cards" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Job Cards</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: jobs
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/jobs</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List job cards (Query: locationId, status)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">POST</span>
              <code className="font-mono text-neutral-800">/api/v1/jobs</code>
              <span className="text-neutral-500 text-[11px] ml-auto">Create a job card</span>
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section id="documents" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Documents</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: documents
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/documents</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List documents with signed S3 URLs</span>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section id="locations" className="scroll-mt-8 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-neutral-900">Locations</h2>
            <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
              Scope: locations
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200 text-xs">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">GET</span>
              <code className="font-mono text-neutral-800">/api/v1/locations</code>
              <span className="text-neutral-500 text-[11px] ml-auto">List all active Dealership locations</span>
            </div>
          </div>
        </section>

        {/* Webhooks Section */}
        <section id="webhooks" className="scroll-mt-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-3">Webhooks</h2>
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            Configure a webhook URL on any API key to receive real-time POST events when data changes. Events are signed with HMAC-SHA256 if a webhook secret is set.
          </p>

          <div className="relative rounded-2xl bg-[#0f172a] text-slate-200 p-5 font-mono text-xs shadow-lg overflow-hidden border border-slate-800">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-[11px] text-slate-400 font-sans ml-2">Node.js — Verify signature</span>
            </div>
            <pre className="overflow-x-auto leading-relaxed">
{`// Verify signature (Node.js)
const sig = req.headers['x-gs-signature'];
const expected = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(req.body))
  .digest('hex');
const valid = sig === expected;`}
            </pre>
          </div>
        </section>

        {/* Key Management Section */}
        <section id="key-management" className="scroll-mt-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Key Management</h2>
          <p className="text-sm text-neutral-500 mb-5">
            Admin role <span className="text-rose-600 font-semibold">required</span> for all key management endpoints.
          </p>

          <div className="space-y-3">
            {/* GET /api/v1/keys */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="font-bold text-[11px] text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg shrink-0">GET</span>
                <code className="font-mono text-sm text-neutral-800 font-semibold">/api/v1/keys</code>
                <Lock className="h-3.5 w-3.5 text-neutral-300 ml-auto shrink-0" />
              </div>
              <div className="px-4 pb-3 text-xs text-neutral-500 -mt-1">
                List all API keys (admin only)
              </div>
            </div>

            {/* POST /api/v1/keys */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="font-bold text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg shrink-0">POST</span>
                <code className="font-mono text-sm text-neutral-800 font-semibold">/api/v1/keys</code>
                <Lock className="h-3.5 w-3.5 text-neutral-300 ml-auto shrink-0" />
              </div>
              <div className="px-4 pb-3 text-xs text-neutral-500 -mt-1">
                Create a new key. Body: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">name*</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">role</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">scopes</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">webhookUrl</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">webhookSecret</code>
              </div>
            </div>

            {/* PATCH /api/v1/keys/:id */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="font-bold text-[11px] text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg shrink-0">PATCH</span>
                <code className="font-mono text-sm text-neutral-800 font-semibold">/api/v1/keys/:id</code>
                <Lock className="h-3.5 w-3.5 text-neutral-300 ml-auto shrink-0" />
              </div>
              <div className="px-4 pb-3 text-xs text-neutral-500 -mt-1">
                Update key: <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">name</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">isActive</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">webhookUrl</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">webhookSecret</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">scopes</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">role</code>
              </div>
            </div>

            {/* DELETE /api/v1/keys/:id */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="font-bold text-[11px] text-rose-600 bg-rose-50 border border-rose-200/60 px-2.5 py-1 rounded-lg shrink-0">DELETE</span>
                <code className="font-mono text-sm text-neutral-800 font-semibold">/api/v1/keys/:id</code>
                <Lock className="h-3.5 w-3.5 text-neutral-300 ml-auto shrink-0" />
              </div>
              <div className="px-4 pb-3 text-xs text-neutral-500 -mt-1">
                Revoke a key (sets <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">isActive=0</code>)
              </div>
            </div>

            {/* GET /api/v1/webhooks/events */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="font-bold text-[11px] text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg shrink-0">GET</span>
                <code className="font-mono text-sm text-neutral-800 font-semibold">/api/v1/webhooks/events</code>
                <Lock className="h-3.5 w-3.5 text-neutral-300 ml-auto shrink-0" />
              </div>
              <div className="px-4 pb-3 text-xs text-neutral-500 -mt-1">
                List last 100 webhook delivery events (admin only)
              </div>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
          <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span className="text-amber-500">⚠</span> Security best practices
          </h3>
          <ul className="space-y-1.5 text-xs text-rose-600 leading-relaxed">
            <li>• Never expose API keys in client-side code or public repositories</li>
            <li>• Use the minimum role and scopes required for each integration</li>
            <li className="text-neutral-700">• Rotate keys regularly and revoke unused keys immediately</li>
            <li className="text-neutral-700">• Always verify webhook signatures before processing events</li>
            <li className="text-neutral-700">• Use HTTPS endpoints for webhook delivery</li>
          </ul>
        </section>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-400 mb-4">
            Good Showroom DMS API v1.0 — BYD <span className="text-rose-600 font-semibold">Harmony</span> Group
          </p>
          <a
            href="/operations/api-keys"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            Manage API Keys
          </a>
        </div>
      </div>
    </div>
  );
}