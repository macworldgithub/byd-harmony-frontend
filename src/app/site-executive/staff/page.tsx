import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Users } from "lucide-react";
import Link from "next/link";

export default function SiteStaffPage() {
  return (
    <div>
      <PageHeader 
        title="Staff Management" 
        subtitle="Manage staff roles and access for this site."
      />
      <Panel className="mt-6 flex flex-col items-center justify-center py-16 text-center max-w-2xl mx-auto border-neutral-200">
        <Users className="h-10 w-10 text-neutral-300 mb-4" />
        <h2 className="text-base font-semibold text-neutral-900">Staff management is handled by Super Admin</h2>
        <p className="mt-1 text-sm text-neutral-500">Contact your Super Admin to add, remove, or modify staff roles and access levels.</p>
        <Link href="/admin/staff-permissions" className="mt-2 text-sm font-medium text-rose-600 hover:underline">
          Go to Super Admin → Staff →
        </Link>
      </Panel>
    </div>
  );
}
