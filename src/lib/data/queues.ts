import type { DeliveryItem, Lead } from "@/lib/types";

export const todaysDeliveries: DeliveryItem[] = Array.from({ length: 7 }).map((_, i) => ({
  id: String(i + 1),
  time: "02:00 pm",
  detail: "First service at 12,000km",
}));

export const deliveryStats = {
  today: 14,
  thisWeek: 14,
  totalScheduled: 15,
};

const makeLead = (id: number, tags: Lead["tags"]): Lead => ({
  id: String(id),
  name: "John Smith",
  phone: "0412345678",
  email: "john@example.com",
  tags,
});

export const activeCustomers: Lead[] = Array.from({ length: 8 }).map((_, i) =>
  makeLead(i + 1, ["prospect", "service"])
);

export const serviceClients: Lead[] = [makeLead(100, ["prospect", "active"])];
