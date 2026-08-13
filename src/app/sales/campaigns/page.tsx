import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import Link from "next/link";

export default function SalesCampaignsPage() {
  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Create and manage bulk SMS and email campaigns."
      />
      <Panel className="mt-6 max-w-2xl text-center py-16 border-neutral-200 flex flex-col items-center mx-auto">
        <h2 className="text-lg font-semibold text-neutral-900">
          Bulk campaigns
        </h2>
        <p className="mt-2 text-neutral-500 mb-6 text-sm">
          Send targeted messages to groups of customers.
        </p>
        <Link
          href="/operations/bulk-sms"
          className="text-rose-600 font-medium hover:underline text-sm"
        >
          Open Bulk SMS tool →
        </Link>
      </Panel>
    </div>
  );
}
