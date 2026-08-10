import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Car } from "lucide-react";
import Link from "next/link";
import { Toolbar } from "@/components/dashboard/Toolbar";

export default function SiteInventoryPage() {
  return (
    <div>
      <PageHeader 
        title="Inventory" 
        action={<Toolbar searchPlaceholder="Search..." />} 
      />
      
      <Panel className="mt-6 flex flex-col items-center justify-center py-16 text-center border-neutral-200">
        <Car className="h-10 w-10 text-neutral-300 mb-4" />
        <h2 className="text-base font-semibold text-neutral-900">Vehicle Inventory</h2>
        <p className="mt-1 text-sm text-neutral-500">Vehicles are tracked per customer. Use the Customers section to view and manage vehicles.</p>
        <Link href="/site-executive/customers" className="mt-2 text-sm font-medium text-rose-600 hover:underline">
          Go to Customers →
        </Link>
      </Panel>
    </div>
  );
}
