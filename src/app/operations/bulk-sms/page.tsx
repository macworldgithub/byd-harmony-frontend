"use client";

import { useState, useEffect } from "react";
import { Plus, Users, ChevronDown, CheckCircle2, Clock, Shield, RefreshCw, Loader2, AlertCircle, Eye } from "lucide-react";
import { API_URL } from "@/lib/config";
import { Modal } from "@/components/ui/Modal";

const TEMPLATES = [
  "Blank message",
  "Service due reminder",
  "Appointment reminder — 24h",
  "Google review request",
  "Delivery day update",
  "New enquiry — test drive invite",
  "Trade-in valuation offer",
];

const AUDIENCE_OPTIONS: { label: string; value: string }[] = [
  { label: "All live clients", value: "all_live_clients" },
  { label: "Buying journey", value: "buying_journey" },
  { label: "Trading/Upgrading", value: "trading_upgrading" },
  { label: "Service & Maintenance", value: "service_maintenance" },
];

const TEMPLATE_BODIES: Record<string, string> = {
  "Blank message": "",
  "Service due reminder": "Hi {{first_name}}, your {{vehicle}} is due for its scheduled service at {{dealership}}. Reply BOOK and we'll find a time that suits you.",
  "Appointment reminder — 24h": "Hi {{first_name}}, a quick reminder about your appointment tomorrow at {{dealership}}. Reply C to confirm or R to reschedule.",
  "Google review request": "Hi {{first_name}}, thanks for visiting {{dealership}}! If you had a great experience, we'd love a quick Google review — it takes 30 seconds: {{review_link}}",
  "Delivery day update": "Hi {{first_name}}, exciting news — your {{vehicle}} is ready for collection at {{dealership}}. When would you like to pick it up?",
  "New enquiry — test drive invite": "Hi {{first_name}}, thanks for your enquiry on the {{vehicle}} at {{dealership}}. Would you like to book a test drive this week? Reply YES and we'll lock in a time.",
  "Trade-in valuation offer": "Hi {{first_name}}, great news — {{vehicle}} models like yours are in strong demand. We can value your car in under 10 minutes. Want us to book you in?",
};

interface BulkCampaign {
  _id: string;
  name: string;
  body: string;
  segment: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BulkSmsPage() {
  const [campaignName, setCampaignName] = useState("");
  const [audience, setAudience] = useState<string>("all_live_clients");
  const [selectedTemplate, setSelectedTemplate] = useState("Blank message");
  const [message, setMessage] = useState("");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);

  // API State
  const [campaigns, setCampaigns] = useState<BulkCampaign[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Selected Campaign Details Modal
  const [selectedCampaign, setSelectedCampaign] = useState<BulkCampaign | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const charCount = message.length;
  const segmentCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  const previewText = message
    ? message
      .replace(/{{first_name}}/g, "Alex")
      .replace(/{{vehicle}}/g, "BYD Atto 3")
      .replace(/{{dealership}}/g, "BYD Caroline Springs")
      .replace(/{{review_link}}/g, "g.page/bydcs")
    : null;

  const fetchCampaigns = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/bulk-campaigns`, {
        headers: {
          accept: "*/*",
        },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCampaigns(json.data);
      } else if (Array.isArray(json)) {
        setCampaigns(json);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    if (!campaignName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Create campaign
      const createRes = await fetch(`${API_URL}/bulk-campaigns`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: campaignName.trim(),
          body: message.trim(),
          segment: audience,
        }),
      });

      const createJson = await createRes.json();

      if (!createRes.ok || !createJson.success) {
        throw new Error(createJson.message || "Failed to create campaign");
      }

      setFeedback({
        type: "success",
        message: "Campaign created successfully!",
      });

      // Reset form & reload list
      setCampaignName("");
      setMessage("");
      setSelectedTemplate("Blank message");
      fetchCampaigns();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    setIsLoadingDetails(true);
    setIsDetailModalOpen(true);
    try {
      const res = await fetch(`${API_URL}/bulk-campaigns/${id}`, {
        headers: {
          accept: "*/*",
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedCampaign(json.data);
      } else {
        throw new Error(json.message || "Failed to fetch details");
      }
    } catch (err: any) {
      console.error(err);
      setSelectedCampaign(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const currentAudienceLabel =
    AUDIENCE_OPTIONS.find((opt) => opt.value === audience)?.label || audience;

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

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Composer */}
        <div className="flex-1 w-full rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
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
            <div className="sm:w-56">
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                Audience segment
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                  className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 hover:bg-white focus:outline-none focus:border-rose-300 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Users className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span className="truncate">{currentAudienceLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                </button>
                {showAudienceDropdown && (
                  <div className="absolute z-20 top-full left-0 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                    {AUDIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setAudience(opt.value);
                          setShowAudienceDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                          audience === opt.value
                            ? "font-semibold text-rose-600 bg-rose-50/50"
                            : "text-neutral-700"
                        }`}
                      >
                        {opt.label}
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
                type="button"
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
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        setMessage(TEMPLATE_BODIES[tmpl] || "");
                        setShowTemplateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                        selectedTemplate === tmpl
                          ? "font-semibold text-rose-600 bg-rose-50/50"
                          : "text-neutral-700"
                      }`}
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
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-500">
              <span className="font-bold text-neutral-800">{segmentCount}</span> segment(s)
            </p>
            <button
              type="button"
              disabled={!message.trim() || !campaignName.trim() || isSubmitting}
              onClick={handleCreateCampaign}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>Create campaign</span>
            </button>
          </div>
        </div>

        {/* Personalised Preview */}
        <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 min-h-[200px]">
          <h3 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
            Personalised Preview
          </h3>
          {previewText ? (
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3">
              <p className="text-xs text-neutral-700 leading-relaxed font-mono whitespace-pre-wrap">{previewText}</p>
              <p className="mt-3 text-[10px] text-neutral-400 border-t border-neutral-200/60 pt-2">
                Preview for: <span className="font-semibold text-neutral-600">Alex · BYD Atto 3</span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 leading-relaxed">
              Write a message to see how each recipient&apos;s version renders with their{" "}
              <span className="text-sky-500 font-medium">name</span>,{" "}
              <span className="text-sky-500 font-medium">vehicle</span> and{" "}
              <span className="text-sky-500 font-medium">dealership</span> merged in.
            </p>
          )}
        </div>
      </div>

      {/* Send History */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            Campaign History
          </h2>
          <button
            onClick={fetchCampaigns}
            disabled={isLoadingHistory}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingHistory ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          {isLoadingHistory && campaigns.length === 0 ? (
            <div className="flex items-center justify-center py-16 gap-2 text-neutral-500 text-sm">
              <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
              <span>Loading campaigns...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-neutral-400">No bulk campaigns found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Segment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Recipients</th>
                    <th className="px-5 py-3.5">Created</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {campaigns.map((camp) => {
                    const statusColor =
                      camp.status === "sent" || camp.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : camp.status === "sending" || camp.status === "in_progress"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : camp.status === "failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-neutral-100 text-neutral-700 border-neutral-200";

                    return (
                      <tr key={camp._id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-neutral-900">
                          <div>{camp.name}</div>
                          <div className="text-xs text-neutral-400 font-normal line-clamp-1 max-w-xs mt-0.5">
                            {camp.body}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700 font-medium">
                            {camp.segment.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor} capitalize`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <div>
                            <span className="font-semibold text-neutral-800">{camp.sentCount || 0}</span>
                            <span className="text-neutral-400"> / {camp.totalRecipients || 0} sent</span>
                          </div>
                          {camp.failedCount > 0 && (
                            <div className="text-rose-500 font-medium">{camp.failedCount} failed</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-neutral-500 whitespace-nowrap">
                          {camp.createdAt ? new Date(camp.createdAt).toLocaleDateString() + " " + new Date(camp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(camp._id)}
                              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Campaign Details"
      >
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12 gap-2 text-neutral-500 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
            <span>Loading campaign info...</span>
          </div>
        ) : selectedCampaign ? (
          <div className="space-y-4 text-sm text-neutral-700">
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Campaign Name
              </span>
              <p className="font-semibold text-neutral-900 text-base">{selectedCampaign.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 capitalize">
                  {selectedCampaign.status}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Segment
                </span>
                <p className="font-medium text-neutral-800">{selectedCampaign.segment.replace(/_/g, " ")}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
              <div>
                <div className="text-lg font-bold text-neutral-900">{selectedCampaign.totalRecipients || 0}</div>
                <div className="text-[11px] text-neutral-500 uppercase">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600">{selectedCampaign.sentCount || 0}</div>
                <div className="text-[11px] text-neutral-500 uppercase">Sent</div>
              </div>
              <div>
                <div className="text-lg font-bold text-rose-600">{selectedCampaign.failedCount || 0}</div>
                <div className="text-[11px] text-neutral-500 uppercase">Failed</div>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Message Body
              </span>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {selectedCampaign.body}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              <div>
                Created: {new Date(selectedCampaign.createdAt).toLocaleString()}
              </div>
              <div>
                Updated: {new Date(selectedCampaign.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-neutral-500">
            Campaign details not available.
          </div>
        )}
      </Modal>
    </div>
  );
}


