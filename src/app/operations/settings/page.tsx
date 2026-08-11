import { PageHeader } from "@/components/dashboard/PageHeader";
import { MessageSquare, Phone, Mail, RefreshCw } from "lucide-react";

export default function OperationsSettingsPage() {
  return (
    <div>
      <div className="mb-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
        System
      </div>
      <PageHeader
        title="Live settings & integrations"
        subtitle="Connection status for the live demo capabilities. Secrets are stored securely as environment variables — never in the browser or database."
      />
      <div className="mb-6">
        <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm">
          <RefreshCw className="h-4 w-4" />
          Re-test connections
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Left column */}
        <div className="space-y-6">
          {/* Live SMS */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Live SMS</h3>
                  <p className="text-sm text-neutral-500">Mobile Message — Australian direct routes</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-500">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-400"></div>
                Not configured
              </span>
            </div>
            
            <div className="p-5 bg-neutral-50/50">
              <h4 className="flex items-center gap-2 text-xs font-bold text-neutral-500 mb-4">
                <span className="h-3 w-3 rounded-full border border-neutral-300"></span>
                Secret slots
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">MOBILEMESSAGE_API_USERNAME</div>
                    <div className="text-xs text-neutral-500 mt-1">API username from your Mobile Message dashboard (Settings — API)</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
                
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">MOBILEMESSAGE_API_PASSWORD</div>
                    <div className="text-xs text-neutral-500 mt-1">API password paired with the username</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">MOBILEMESSAGE_SENDER</div>
                    <div className="text-xs text-neutral-500 mt-1">Registered Sender ID — use your dedicated number for two-way replies</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email (SMTP) */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Email (SMTP)</h3>
                  <p className="text-sm text-neutral-500">Branded HTML emails for live demos</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-500">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-400"></div>
                Not configured
              </span>
            </div>
            
            <div className="p-5 bg-neutral-50/50">
              <h4 className="flex items-center gap-2 text-xs font-bold text-neutral-500 mb-4">
                <span className="h-3 w-3 rounded-full border border-neutral-300"></span>
                Secret slots
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">SMTP_HOST</div>
                    <div className="text-xs text-neutral-500 mt-1">SMTP server hostname (e.g. smtp.gmail.com)</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
                
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">SMTP_PORT</div>
                    <div className="text-xs text-neutral-500 mt-1">SMTP port (587 for TLS, 465 for SSL)</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
                
                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">SMTP_USER</div>
                    <div className="text-xs text-neutral-500 mt-1">SMTP login username / email</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>

                <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">SMTP_PASS</div>
                    <div className="text-xs text-neutral-500 mt-1">SMTP password or app-specific password</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-neutral-900 font-mono">SMTP_FROM</div>
                    <div className="text-xs text-neutral-500 mt-1">From address shown to recipients (optional - defaults to user)</div>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">Awaiting value</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Click-to-call */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                  <Phone className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Click-to-call</h3>
                  <p className="text-sm text-neutral-500">AI voice demo call launcher</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-500">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-400"></div>
                Provisioned
              </span>
            </div>
            
            <div className="p-5">
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                The Call button in every live thread is wired to this slot. When your voice provider is ready, add the launch URL and the button activates instantly — no rebuild needed.
              </p>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-neutral-900 font-mono">CLICK_TO_CALL_URL</div>
                  <div className="text-xs text-neutral-500 mt-1 max-w-[200px] sm:max-w-xs">URL that launches the demo call experience — added later when your call provider is ready</div>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded shrink-0">Awaiting value</span>
              </div>
            </div>
            
            <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-100 text-center">
              <span className="text-xs text-neutral-400">Awaiting call provider — the slot is live and waiting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
