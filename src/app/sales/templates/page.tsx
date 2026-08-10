import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";

export default function SalesTemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Message Templates"
        subtitle="Manage reusable SMS and email templates for sales communications."
      />
      <div className="mt-6">
        <Link href="#" className="text-rose-600 font-medium hover:underline text-sm">
          Open Templates Library →
        </Link>
      </div>
    </div>
  );
}
