"use client";

import { useState } from "react";
import { Send, Users, ChevronDown, CheckCircle2, Clock, Shield } from "lucide-react";

const TEMPLATES = [
  "Blank message",
  "Service due reminder",
  "Appointment reminder — 24h",
  "Google review request",
  "Delivery day update",
  "New enquiry — test drive invite",
  "Trade-in valuation offer",
];

const AUDIENCE_OPTIONS = ["All live clients", "Sales contacts", "Service contacts", "Flagged contacts"];

const TEMPLATE_BODIES: Record<string, string> = {
  "Blank message": "",
  "Service due reminder": "Hi {{first_name}}, your {{vehicle}} is due for its scheduled service at {{dealership}}. Reply BOOK and we'll find a time that suits you.",
  "Appointment reminder — 24h": "Hi {{first_name}}, a quick reminder about your appointment tomorrow at {{dealership}}. Reply C to confirm or R to reschedule.",
  "Google review request": "Hi {{first_name}}, thanks for visiting {{dealership}}! If you had a great experience, we'd love a quick Google review — it takes 30 seconds: {{review_link}}",
  "Delivery day update": "Hi {{first_name}}, exciting news — your {{vehicle}} is ready for collection at {{dealership}}. When would you like to pick it up?",
  "New enquiry — test drive invite": "Hi {{first_name}}, thanks for your enquiry on the {{vehicle}} at {{dealership}}. Would you like to book a test drive this week? Reply YES and we'll lock in a time.",
  "Trade-in valuation offer": "Hi {{first_name}}, great news — {{vehicle}} models like yours are in strong demand. We can value your car in under 10 minutes. Want us to book you in?",
};

export default function BulkSmsPage() {
  const [campaignName, setCampaignName] = useState("");
  const [audience, setAudience] = useState("All live clients");
  const [selectedTemplate, setSelectedTemplate] = useState("Blank message");
  const [message, setMessage] = useState("");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);

  const charCount = message.length;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  const previewText = message
    ? message
        .replace(/{{first_name}}/g, "Alex")
        .replace(/{{vehicle}}/g, "BYD Atto 3")
        .replace(/{{dealership}}/g, "BYD Caroline Springs")
        .replace(/{{review_link}}/g, "g.page/bydcs")
    : null;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
          One-to-Many
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Bulk SMS</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Personalised at scale —{" "}
          <span className="text-neutral-700">every recipient</span> gets their
          own merge-rendered message in the unified thread.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Composer */}
        <div className="flex-1 rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
          {/* Campaign Name + Audience */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                Campaign name
              </label>
              <input
                type="text"
                placeholder="e.g. July service reminders"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-colors"
              />
            </div>
            <div className="sm:w-52">
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                Audience segment
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                  className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 hover:bg-white focus:outline-none focus:border-rose-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span>{audience}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                </button>
                {showAudienceDropdown && (
                  <div className="absolute z-20 top-full left-0 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                    {AUDIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setAudience(opt); setShowAudienceDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${audience === opt ? "font-semibold text-rose-600" : "text-neutral-700"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Start from a template */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Start from a template
            </label>
            <div className="relative inline-block">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 hover:bg-white transition-colors"
              >
                {selectedTemplate}
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              {showTemplateDropdown && (
                <div className="absolute z-20 top-full left-0 mt-1 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl}
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        setMessage(TEMPLATE_BODIES[tmpl] || "");
                        setShowTemplateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${selectedTemplate === tmpl ? "font-semibold text-rose-600" : "text-neutral-700"}`}
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message textarea */}
          <div className="mb-3">
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Hi {{first_name}}, ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none transition-colors font-mono"
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              {charCount} chars · {segmentCount} segment{segmentCount !== 1 ? "s" : ""} per message
            </p>
          </div>

          {/* Compliance badges */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 mb-5">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Opt-out honoured (STOP)
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              Quiet hours 8pm–8am enforced
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              ACMA Sender ID registered
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              <span className="font-bold text-neutral-800">0</span> recipients ·{" "}
              <span className="font-bold text-neutral-800">0</span> credits
            </p>
            <button
              disabled={!message || !campaignName}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="h-4 w-4" />
              Send campaign
            </button>
          </div>
        </div>

        {/* Personalised Preview */}
        <div className="lg:w-72 shrink-0 rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 min-h-[200px]">
          <h3 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
            Personalised Preview
          </h3>
          {previewText ? (
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3">
              <p className="text-xs text-neutral-700 leading-relaxed">{previewText}</p>
              <p className="mt-2 text-[10px] text-neutral-400">
                Preview for: <span className="font-semibold text-neutral-600">Alex · BYD Atto 3</span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 leading-relaxed">
              Write a message to see how each recipient&apos;s version renders with their{" "}
              <span className="text-sky-500">name</span>,{" "}
              <span className="text-sky-500">vehicle</span> and{" "}
              <span className="text-sky-500">dealership</span> merged in.
            </p>
          )}
        </div>
      </div>

      {/* Send History */}
      <div className="mt-8">
        <h2 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
          Send History
        </h2>
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm flex items-center justify-center py-16">
          <p className="text-sm text-neutral-400">No bulk sends yet.</p>
        </div>
      </div>
    </div>
  );
}
