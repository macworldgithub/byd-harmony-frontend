import { Toolbar } from "@/components/dashboard/Toolbar";

const customers = [
  { id: 1, name: "Lee Atkinson", phone: "6411111111" },
  { id: 2, name: "John Smith", phone: "0412345678", active: true },
  { id: 3, name: "John Smith", phone: "0412345678" },
  { id: 4, name: "John Smith", phone: "0412345678" },
  { id: 5, name: "John Smith", phone: "0412345678" },
  { id: 6, name: "John Smith", phone: "0412345678" },
  { id: 7, name: "John Smith", phone: "0412345678" },
];

export default function ServiceCommunicationsPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 p-2">
      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <Toolbar searchPlaceholder="Search..." />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {customers.map((c) => (
            <div key={c.id} className={`p-3 rounded-md cursor-pointer ${c.active ? 'bg-rose-50 border border-rose-200' : 'hover:bg-neutral-50'} mb-1`}>
              <div className="font-medium text-neutral-900">{c.name}</div>
              <div className="text-sm text-neutral-500">{c.phone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">John Smith</h2>
            <p className="text-sm text-neutral-500">0412345678 - john@example.com</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-rose-600 text-white px-4 py-1.5 rounded text-sm font-medium">SMS</button>
            <button className="bg-neutral-100 text-neutral-700 px-4 py-1.5 rounded text-sm font-medium">NOTE</button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/30">
          <div className="max-w-[70%] bg-neutral-100 p-3 rounded-lg rounded-tl-none">
            <div className="text-sm text-neutral-900 font-medium">Customer called to confirm service appointment</div>
            <div className="text-xs text-neutral-400 mt-1">note - 12:00 am</div>
          </div>
          <div className="max-w-[70%] bg-neutral-100 p-3 rounded-lg rounded-tl-none">
            <div className="text-sm text-neutral-900 font-medium">Job BYD-00007 status: in_progress</div>
            <div className="text-xs text-neutral-400 mt-1">system - 12:00 am</div>
          </div>
          <div className="max-w-[70%] bg-neutral-100 p-3 rounded-lg rounded-tl-none">
            <div className="text-sm text-neutral-900 font-medium">Job card BYD-00007 created — normal priority</div>
            <div className="text-xs text-neutral-400 mt-1">system - 12:00 am</div>
          </div>
          <div className="max-w-[70%] bg-neutral-100 p-3 rounded-lg rounded-tl-none">
            <div className="text-sm text-neutral-900 font-medium">Service booking created for 10/08/2026 — routine</div>
            <div className="text-xs text-neutral-400 mt-1">system - 12:00 am</div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-neutral-200 bg-white flex gap-3">
          <input 
            type="text" 
            placeholder="Type SMS..." 
            className="flex-1 border border-neutral-200 rounded-md px-4 py-2 focus:outline-none focus:border-rose-500 text-sm"
          />
          <button className="bg-rose-400 text-white px-6 py-2 rounded-md font-medium hover:bg-rose-500 transition-colors text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
