import { PageHeader } from "@/components/dashboard/PageHeader";
import { FileText, Plus } from "lucide-react";

export default function OperationsDocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Manage service documents and reports"
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Document
          </button>
        }
      />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
          <FileText className="h-7 w-7 text-neutral-400" />
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-600">No documents yet</p>
        <p className="mt-1 text-xs text-neutral-400">Documents will appear here once created.</p>
      </div>
    </div>
  );
}
