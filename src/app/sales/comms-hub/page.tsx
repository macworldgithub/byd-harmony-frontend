import { Toolbar } from "@/components/dashboard/Toolbar";

const customers = [
  { id: 1, name: "Lee Atkinson", stage: "prospect", active: true },
  { id: 2, name: "John Smith", stage: "service" },
  { id: 3, name: "John Smith", stage: "active" },
  { id: 4, name: "John Smith", stage: "active" },
  { id: 5, name: "John Smith", stage: "active" },
  { id: 6, name: "John Smith", stage: "active" },
  { id: 7, name: "John Smith", stage: "active" },
];

export default function SalesCommsHubPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 p-2">
      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <Toolbar searchPlaceholder="Search customers..." />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {customers.map((c) => (
            <div key={c.id} className={`p-3 rounded-md cursor-pointer flex flex-col gap-1 ${c.active ? 'bg-rose-50 border border-rose-200' : 'hover:bg-neutral-50 border border-transparent'}`}>
              <div className="font-medium text-neutral-900">{c.name}</div>
              <div className={`text-xs font-semibold ${c.stage === 'prospect' ? 'text-blue-600' : c.stage === 'service' ? 'text-orange-600' : 'text-green-600'}`}>{c.stage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Lee Atkinson</h2>
              <p className="text-sm text-neutral-500">📞 6411111111 ✉️ lee@atkinson.com</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-rose-600 text-white px-4 py-1.5 rounded text-sm font-medium">SMS</button>
              <button className="bg-neutral-100 text-neutral-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-neutral-200">EMAIL</button>
              <button className="bg-neutral-100 text-neutral-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-neutral-200">NOTE</button>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-500 mb-2">Quick Templates</div>
            <div className="flex gap-2 overflow-x-auto">
              <button className="whitespace-nowrap bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 transition-colors">New enquiry — test drive i...</button>
              <button className="whitespace-nowrap bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 transition-colors">Trade-in valuation offer</button>
              <button className="whitespace-nowrap bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 transition-colors">Service due reminder</button>
              <button className="whitespace-nowrap bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 transition-colors">Appointment reminder — 2...</button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/30">
          <div className="max-w-[70%] bg-neutral-100 p-3 rounded-lg rounded-tl-none">
            <div className="text-sm text-neutral-900 font-medium">Customer profile created for Lee Atkinson</div>
            <div className="text-xs text-neutral-400 mt-1 uppercase">SYSTEM · 10 Aug, 11:55 am</div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-neutral-200 bg-white flex gap-3 items-end">
          <input 
            type="text" 
            placeholder="Type SMS message..." 
            className="flex-1 border border-neutral-200 rounded-md px-4 py-3 focus:outline-none focus:border-rose-500 text-sm"
          />
          <div className="flex gap-2">
             <button className="w-11 h-11 flex justify-center items-center rounded-md text-neutral-500 hover:bg-neutral-100 border border-neutral-200 text-lg transition-colors">🚗</button>
             <button className="w-11 h-11 flex justify-center items-center rounded-md text-neutral-500 hover:bg-neutral-100 border border-neutral-200 text-lg transition-colors">✨</button>
             <button className="w-11 h-11 flex justify-center items-center rounded-md bg-rose-400 hover:bg-rose-500 text-white border border-rose-400 transition-colors">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}
