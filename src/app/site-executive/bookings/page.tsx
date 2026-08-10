import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";

export default function SiteBookingsPage() {
  return (
    <div>
      <PageHeader title="Site Bookings" />
      <div className="mt-4">
        <Link href="/admin/bookings" className="text-rose-600 hover:underline">
          Open Bookings →
        </Link>
      </div>
    </div>
  );
}
