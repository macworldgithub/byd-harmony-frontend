import { PageHeader } from "@/components/dashboard/PageHeader";
import { UserPlus, MessageSquare } from "lucide-react";

export default function OperationsLiveCommsPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
            </div>
            Live demo clients
          </h1>
          <p className="text-sm text-neutral-500">
            Add a one-off contact, send them a real SMS, and watch replies land in the thread — in front of the room.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
          <UserPlus className="h-4 w-4" />
          Add live client
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Queue */}
        <div className="w-80 border-r border-neutral-200 bg-white flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <span className="text-xs font-bold tracking-widest text-neutral-400">
              LIVE QUEUE
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
              0
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <UserPlus className="h-8 w-8 text-neutral-300" />
            <p className="mt-3 text-sm font-semibold text-neutral-900">
              No live clients yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Add a one-off contact to run a live SMS interaction in your next partner demo.
            </p>
            <button className="mt-4 flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors">
              <UserPlus className="h-4 w-4" />
              Add live client
            </button>
          </div>
        </div>

        {/* Right main - Chat */}
        <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50/50 p-6 text-center">
          <MessageSquare className="h-10 w-10 text-neutral-300" />
          <p className="mt-4 text-sm font-semibold text-neutral-900">
            Select or add a live client
          </p>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            Live threads are backed by a real database and your SMS provider — everything the room sees is actually happening.
          </p>
        </div>
      </div>
    </div>
  );
}
