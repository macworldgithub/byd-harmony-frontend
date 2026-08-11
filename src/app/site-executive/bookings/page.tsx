import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function SiteBookingsPage() {
  return (
    <div>
      <PageHeader
        title="Site Bookings"
        subtitle="Manage all service bookings for this site"
      />
      <div className="mt-4">
        <Link
          href="/operations/bookings"
          className="text-rose-600 hover:underline"
        >
          Open Bookings →
        </Link>
      </div>
    </div>
  );
}
