"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

const PRE_CHECKLIST = [
  { id: 1, label: "Vehicle inspection completed", checked: false },
  {
    id: 2,
    label: "Paint and body check — no scratches or dents",
    checked: false,
  },
  { id: 3, label: "Interior clean and detailed", checked: false },
  { id: 4, label: "All fluids topped up", checked: false },
  { id: 5, label: "Tyre pressures set to spec", checked: false },
  { id: 6, label: "All accessories fitted and tested", checked: false },
  { id: 7, label: "Registration and CTP confirmed", checked: false },
  { id: 8, label: "Finance documents prepared", checked: false },
  { id: 9, label: "Handover pack assembled", checked: false },
  { id: 10, label: "Customer notified of delivery time", checked: false },
];

const POST_CHECKLIST = [
  { id: 101, label: "Customer signed delivery receipt", checked: false },
  { id: 102, label: "Keys and spare keys handed over", checked: false },
  {
    id: 103,
    label: "Vehicle walkthrough completed with customer",
    checked: false,
  },
  { id: 104, label: "Technology features demonstrated", checked: false },
  { id: 105, label: "Service schedule explained", checked: false },
  { id: 106, label: "Warranty documentation provided", checked: false },
  { id: 107, label: "Customer satisfaction confirmed", checked: false },
  { id: 108, label: "Follow-up call scheduled", checked: false },
];

export default function DeliveryChecklistsPage() {
  const [activeTab, setActiveTab] = useState<"pre" | "post">("pre");
  const [preItems, setPreItems] = useState(PRE_CHECKLIST);
  const [postItems, setPostItems] = useState(POST_CHECKLIST);

  const items = activeTab === "pre" ? preItems : postItems;

  const toggleItem = (id: number) => {
    if (activeTab === "pre") {
      setPreItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
      );
    } else {
      setPostItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
      );
    }
  };

  const completedCount = items.filter((i) => i.checked).length;

  const markAllDone = () => {
    if (activeTab === "pre") {
      setPreItems((prev) => prev.map((it) => ({ ...it, checked: true })));
    } else {
      setPostItems((prev) => prev.map((it) => ({ ...it, checked: true })));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Delivery Checklists"
        subtitle="Complete all items before and after each vehicle delivery."
      />

      <div className="mt-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("pre")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "pre"
                ? "bg-rose-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Pre-Delivery
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "post"
                ? "bg-rose-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Post-Delivery
          </button>
        </div>

        <Panel padded={false} className="border-neutral-200">
          <div className="rounded-lg overflow-hidden divide-y divide-neutral-100">
            {items.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                  item.checked ? "bg-rose-50/20" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 text-rose-600 rounded border-neutral-300 focus:ring-rose-500"
                />
                <span
                  className={`text-sm ${item.checked ? "text-neutral-400 line-through" : "text-neutral-700"}`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Panel>

        <div className="mt-4 flex justify-between items-center text-sm text-neutral-500">
          <span>
            {completedCount} of {items.length} completed
          </span>
          <button
            onClick={markAllDone}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium transition-colors"
          >
            Mark all done
          </button>
        </div>
      </div>
    </div>
  );
}
