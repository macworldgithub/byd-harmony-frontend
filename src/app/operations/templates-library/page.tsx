"use client";

import { useState } from "react";
import { MessageSquare, Plus, Send, Edit2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const templates = [
  {
    id: "t-1",
    title: "Service due reminder",
    category: "SERVICE",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, your {{vehicle}} is due for its scheduled service at {{dealership}}. Reply BOOK and we'll find a time that suits you.",
    chars: 136,
    segments: 1,
    highlight: "blue",
  },
  {
    id: "t-2",
    title: "Appointment reminder — 24h",
    category: "REMINDERS",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, a quick reminder about your appointment tomorrow at {{dealership}}. Reply C to confirm or R to reschedule.",
    chars: 126,
    segments: 1,
    highlight: "blue",
  },
  {
    id: "t-3",
    title: "Google review request",
    category: "REVIEWS",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, thanks for visiting {{dealership}}! If you had a great experience, we'd love a quick Google review — it takes 30 seconds: {{review_link}}",
    chars: 160,
    segments: 1,
    highlight: "blue",
  },
  {
    id: "t-4",
    title: "Delivery day update",
    category: "SALES",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, exciting news — your {{vehicle}} is ready for collection at {{dealership}}. When would you like to pick it up?",
    chars: 129,
    segments: 1,
    highlight: "green",
  },
  {
    id: "t-5",
    title: "New enquiry — test drive invite",
    category: "SALES",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, thanks for your enquiry on the {{vehicle}} at {{dealership}}. Would you like to book a test drive this week? Reply YES and we'll lock in a time.",
    chars: 165,
    segments: 2,
    highlight: "blue",
  },
  {
    id: "t-6",
    title: "Trade-in valuation offer",
    category: "SALES",
    type: "SMS",
    badge: "Starter",
    body: "Hi {{first_name}}, great news — {{vehicle}} models like yours are in strong demand. We can value your car in under 10 minutes. Want us to book you in?",
    chars: 150,
    segments: 1,
    highlight: "green",
  },
];

const FILTERS = ["All", "Sales", "Service", "Reviews", "Reminders", "General"];

const highlightMergeTags = (text: string, color: "blue" | "green") => {
  const colorClass = color === "blue" ? "text-blue-600" : "text-emerald-600";
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) =>
    part.startsWith("{{") ? (
      <span key={i} className={`font-semibold ${colorClass}`}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
};

export default function TemplatesLibraryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    type: "SMS",
    body: "",
  });
  const router = useRouter();

  const filtered = templates.filter((t) => {
    if (activeFilter === "All") return true;
    return t.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleCreateTemplate = () => {
    // TODO: Submit form data to API
    console.log("Creating template:", formData);
    setFormData({ name: "", category: "General", type: "SMS", body: "" });
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
            Message Library
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Templates</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Reusable messages with merge tags — one click from any thread or
            bulk send.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => router.push("/operations/bulk-sms")}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
          >
            <Send className="h-4 w-4" />
            Bulk send
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New template
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeFilter === filter
                ? filter === "All"
                  ? "bg-rose-600 text-white"
                  : "bg-neutral-200 text-neutral-800"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                  <MessageSquare className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                    {template.title}
                  </h3>
                  <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mt-0.5">
                    {template.category} · {template.type}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-bold text-neutral-500">
                {template.badge}
              </span>
            </div>

            {/* Card Body */}
            <div className="flex-1 px-4 pb-3">
              <p className="text-[13px] text-neutral-700 leading-relaxed">
                {highlightMergeTags(
                  template.body,
                  template.highlight as "blue" | "green",
                )}
              </p>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5">
              <span className="text-[11px] text-neutral-400">
                {template.chars} chars · {template.segments} segment
                {template.segments > 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-1">
                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 transition-colors text-neutral-400 hover:text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="h-10 w-10 text-neutral-200 mb-4" />
          <p className="text-sm font-semibold text-neutral-500">
            No templates in this category
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Create a new template to get started.
          </p>
        </div>
      )}

      {/* New Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900">
                New template
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Template name
                </label>
                <input
                  type="text"
                  placeholder="Template name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option>General</option>
                    <option>Sales</option>
                    <option>Service</option>
                    <option>Reviews</option>
                    <option>Reminders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Hi {{first_name}}, ..."
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  rows={5}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* Merge Tags Reference */}
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                  Available merge tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "{{first_name}}",
                    "{{last_name}}",
                    "{{vehicle}}",
                    "{{dealership}}",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-white border border-neutral-200 rounded px-2 py-1 text-[10px] font-mono text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Create template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
