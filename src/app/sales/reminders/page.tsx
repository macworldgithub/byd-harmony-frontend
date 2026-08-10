import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

export default function SalesRemindersPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Follow-up Reminders</h1>
          <p className="text-sm text-neutral-500 mt-1">1 open · 0 overdue</p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
          + Add Reminder
        </button>
      </div>

      <div className="space-y-2">
        <Panel padded={false} className="border-neutral-200">
          <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500" />
            <span className="flex-1 font-medium text-neutral-900 text-sm">hello bello</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">19 Aug</span>
              <button className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
          </label>
        </Panel>
      </div>
    </div>
  );
}
