import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";

export default function SiteJobCardsPage() {
  return (
    <div>
      <PageHeader title="Site Job Cards" />
      <div className="mt-4">
        <Link
          href="/operations/job-cards"
          className="text-rose-600 hover:underline"
        >
          Open Job Cards →
        </Link>
      </div>
    </div>
  );
}
