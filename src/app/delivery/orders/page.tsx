"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { X, Plus } from "lucide-react";

const orders = Array.from({ length: 10 }, (_, i) => ({
  id: `BYD-0001${6 - i}`,
  description: "12,000km routine service",
  status: "IN PROGRESS",
}));

export default function DeliveryOrdersPage() {
  return (
    <div>
      <PageHeader title="Delivery Orders" subtitle="16 total orders" />

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <Panel key={order.id} padded={false} className="border-neutral-200">
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-semibold text-neutral-900">{order.id}</div>
                <div className="text-sm text-neutral-500 mt-1">
                  {order.description}
                </div>
              </div>
              <div className="bg-neutral-100 text-neutral-600 text-[11px] font-bold px-2 py-1 rounded-md tracking-wider">
                {order.status}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
