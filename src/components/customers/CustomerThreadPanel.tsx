"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Loader2,
  Send,
  ChevronDown,
  User,
  Zap,
  StickyNote,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { API_URL } from "@/lib/config";

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface ThreadAttachment {
  filename: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface ThreadAuthor {
  userId?: string;
  name?: string;
  role?: string;
}

export interface ThreadEntry {
  _id: string;
  customerId: string;
  type: "note" | "email" | "sms" | "call" | "document" | "system";
  direction: "inbound" | "outbound" | "internal";
  subject?: string;
  body: string;
  attachments?: ThreadAttachment[];
  author?: ThreadAuthor;
  createdAt: string;
  updatedAt: string;
}

interface ThreadMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function groupByDate(entries: ThreadEntry[]): Array<{ date: string; items: ThreadEntry[] }> {
  const groups: Record<string, ThreadEntry[]> = {};
  entries.forEach((e) => {
    const dateKey = new Date(e.createdAt).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(e);
  });
  return Object.entries(groups).map(([, items]) => ({
    date: items[0].createdAt,
    items,
  }));
}

/* ─── Type icon / label ─────────────────────────────────────────────────── */
const TYPE_META: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  note: {
    icon: <StickyNote className="h-3 w-3" />,
    label: "Note",
    color: "text-amber-600",
  },
  email: {
    icon: <Mail className="h-3 w-3" />,
    label: "Email",
    color: "text-blue-600",
  },
  sms: {
    icon: <MessageSquare className="h-3 w-3" />,
    label: "SMS",
    color: "text-emerald-600",
  },
  call: {
    icon: <Phone className="h-3 w-3" />,
    label: "Call",
    color: "text-violet-600",
  },
  document: {
    icon: <FileText className="h-3 w-3" />,
    label: "Document",
    color: "text-slate-600",
  },
  system: {
    icon: <Zap className="h-3 w-3" />,
    label: "System",
    color: "text-neutral-400",
  },
};

/* ─── Bubble component ───────────────────────────────────────────────────── */
function ThreadBubble({
  entry,
  onDelete,
}: {
  entry: ThreadEntry;
  onDelete?: (id: string) => void;
}) {
  const meta = TYPE_META[entry.type] ?? TYPE_META.note;
  const isSystem = entry.type === "system";
  const isOutbound = entry.direction === "outbound";
  const isInbound = entry.direction === "inbound";

  const authorName = entry.author?.name || "Staff";
  const authorInitials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-neutral-100" />
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium px-3 py-1 bg-neutral-50 rounded-full border border-neutral-100">
          <Zap className="h-3 w-3" />
          {entry.body}
          <span className="text-neutral-300">·</span>
          {formatTime(entry.createdAt)}
        </div>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>
    );
  }

  if (isOutbound) {
    return (
      <div className="flex items-end gap-2 justify-end group">
        <div className="max-w-[75%]">
          {entry.subject && (
            <p className="text-xs font-semibold text-right text-neutral-500 mb-1 pr-1">
              {entry.subject}
            </p>
          )}
          <div
            className="rounded-2xl rounded-br-md px-4 py-3 text-sm text-white leading-relaxed shadow-sm"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            }}
          >
            {entry.body}
          </div>
          <div className="flex items-center justify-end gap-2 mt-1 pr-1">
            <span
              className={`flex items-center gap-1 text-[10px] font-medium ${meta.color}`}
            >
              {meta.icon} {meta.label}
            </span>
            <span className="text-[10px] text-neutral-400">
              {formatTime(entry.createdAt)}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(entry._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
          {entry.attachments && entry.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5 justify-end">
              {entry.attachments.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                >
                  <FileText className="h-2.5 w-2.5" />
                  {a.filename}
                </a>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}
          title={authorName}
        >
          {authorInitials}
        </div>
      </div>
    );
  }

  if (isInbound) {
    return (
      <div className="flex items-end gap-2 group">
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
          title="Customer"
        >
          <User className="h-3.5 w-3.5" />
        </div>
        <div className="max-w-[75%]">
          {entry.subject && (
            <p className="text-xs font-semibold text-neutral-500 mb-1 pl-1">
              {entry.subject}
            </p>
          )}
          <div className="rounded-2xl rounded-bl-md bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-800 leading-relaxed shadow-sm">
            {entry.body}
          </div>
          <div className="flex items-center gap-2 mt-1 pl-1">
            <span
              className={`flex items-center gap-1 text-[10px] font-medium ${meta.color}`}
            >
              {meta.icon} {meta.label}
            </span>
            <span className="text-[10px] text-neutral-400">
              {formatTime(entry.createdAt)}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(entry._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
          {entry.attachments && entry.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {entry.attachments.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full border border-neutral-200 hover:bg-neutral-200 transition-colors"
                >
                  <FileText className="h-2.5 w-2.5" />
                  {a.filename}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Internal note
  return (
    <div className="flex items-end gap-2 group">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
        title={authorName}
      >
        {authorInitials}
      </div>
      <div className="max-w-[75%]">
        {entry.subject && (
          <p className="text-xs font-semibold text-neutral-500 mb-1 pl-1">
            {entry.subject}
          </p>
        )}
        <div className="rounded-2xl rounded-bl-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-neutral-800 leading-relaxed shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mb-1">
            <StickyNote className="h-3 w-3" />
            Internal Note
          </div>
          {entry.body}
        </div>
        <div className="flex items-center gap-2 mt-1 pl-1">
          <span className="text-[10px] text-neutral-400">{authorName}</span>
          <span className="text-neutral-300 text-[10px]">·</span>
          <span className="text-[10px] text-neutral-400">
            {formatTime(entry.createdAt)}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(entry._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {entry.attachments && entry.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {entry.attachments.map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors"
              >
                <FileText className="h-2.5 w-2.5" />
                {a.filename}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Compose bar ────────────────────────────────────────────────────────── */
const TYPE_OPTIONS = [
  { value: "note", label: "Note", direction: "internal" },
  { value: "email", label: "Email", direction: "outbound" },
  { value: "sms", label: "SMS", direction: "outbound" },
  { value: "call", label: "Call", direction: "outbound" },
] as const;

/* ─── Main Panel ─────────────────────────────────────────────────────────── */
export interface CustomerThreadPanelProps {
  customerId: string;
}

export function CustomerThreadPanel({ customerId }: CustomerThreadPanelProps) {
  const [entries, setEntries] = useState<ThreadEntry[]>([]);
  const [meta, setMeta] = useState<ThreadMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [composeBody, setComposeBody] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeType, setComposeType] = useState<"note" | "email" | "sms" | "call">("note");
  const [showSubject, setShowSubject] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, []);

  const fetchThread = useCallback(
    async (pageParam: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/customers/${customerId}/thread?page=${pageParam}&limit=50`,
          { headers: getAuthHeaders() }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setEntries((prev) =>
            append ? [...data.data, ...prev] : data.data
          );
          setMeta(data.meta);
          if (!append) scrollToBottom();
        } else {
          setError(data.message || "Failed to load thread.");
        }
      } catch {
        setError("Unable to reach the server.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [customerId, scrollToBottom]
  );

  useEffect(() => {
    setEntries([]);
    setPage(1);
    fetchThread(1);
  }, [customerId, fetchThread]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchThread(nextPage, true);
  };

  const handleSend = async () => {
    const body = composeBody.trim();
    if (!body) return;
    setSending(true);
    setSendError(null);

    const typeOption = TYPE_OPTIONS.find((o) => o.value === composeType);
    const direction = typeOption?.direction ?? "internal";

    try {
      const payload: Record<string, unknown> = { type: composeType, direction, body };
      if (showSubject && composeSubject.trim()) {
        payload.subject = composeSubject.trim();
      }

      const res = await fetch(`${API_URL}/customers/${customerId}/thread`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEntries((prev) => [...prev, data.data]);
        setComposeBody("");
        setComposeSubject("");
        if (meta) setMeta({ ...meta, total: meta.total + 1 });
        scrollToBottom();
      } else {
        setSendError(data.message || "Failed to send.");
      }
    } catch {
      setSendError("Unable to reach the server.");
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      const res = await fetch(
        `${API_URL}/customers/${customerId}/thread/${entryId}`,
        { method: "DELETE", headers: getAuthHeaders() }
      );
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e._id !== entryId));
      }
    } catch {
      // silent
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const groups = groupByDate(entries);
  const hasMore = meta ? meta.page < meta.pages : false;

  const currentTypeOption = TYPE_OPTIONS.find((o) => o.value === composeType)!;

  const COMPOSE_ACCENT: Record<string, string> = {
    note: "#d97706",
    email: "#2563eb",
    sms: "#059669",
    call: "#7c3aed",
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Thread area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              Load older messages ({meta ? meta.total - entries.length : 0} more)
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-sm text-neutral-400">Loading thread…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <span className="text-sm text-red-600 flex-1">{error}</span>
            <button
              onClick={() => fetchThread(1)}
              className="text-red-500 hover:text-red-700"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-neutral-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500">
                No messages yet
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Start the conversation by posting a note below
              </p>
            </div>
          </div>
        )}

        {/* Thread grouped by date */}
        {!loading &&
          !error &&
          groups.map((group, gi) => (
            <div key={gi} className="space-y-3">
              {/* Date divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-100" />
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {formatDateLabel(group.date)}
                </span>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>

              {group.items.map((entry) => (
                <ThreadBubble
                  key={entry._id}
                  entry={entry}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      {/* ── Compose area ────────────────────────────────────────────────── */}
      <div
        className="border-t border-neutral-200 bg-white px-4 py-3 space-y-2"
        style={{ flexShrink: 0 }}
      >
        {/* Type selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-neutral-100 p-1">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setComposeType(opt.value);
                  setShowSubject(opt.value === "email");
                }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                style={
                  composeType === opt.value
                    ? {
                        background: COMPOSE_ACCENT[opt.value],
                        color: "#fff",
                        boxShadow: `0 1px 4px ${COMPOSE_ACCENT[opt.value]}55`,
                      }
                    : { color: "#737373" }
                }
              >
                {TYPE_META[opt.value].icon}
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          {meta && (
            <span className="text-[10px] text-neutral-400 font-medium">
              {meta.total} message{meta.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Subject line (email only) */}
        {showSubject && (
          <input
            type="text"
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
            placeholder="Subject…"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          />
        )}

        {/* Body textarea + send */}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              composeType === "note"
                ? "Write an internal note…"
                : composeType === "email"
                ? "Compose an email…"
                : composeType === "sms"
                ? "Write an SMS message…"
                : "Log a call…"
            }
            rows={2}
            className="flex-1 resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-1 transition-colors placeholder:text-neutral-400"
            style={
              composeBody
                ? {
                    borderColor: COMPOSE_ACCENT[composeType],
                    boxShadow: `0 0 0 1px ${COMPOSE_ACCENT[composeType]}`,
                  }
                : {}
            }
          />
          <button
            onClick={handleSend}
            disabled={!composeBody.trim() || sending}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: COMPOSE_ACCENT[composeType],
              boxShadow: `0 4px 12px ${COMPOSE_ACCENT[composeType]}55`,
            }}
            title="Send (Ctrl+Enter)"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Send error */}
        {sendError && (
          <p className="text-xs text-red-500">{sendError}</p>
        )}

        <p className="text-[10px] text-neutral-400">
          Press{" "}
          <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[9px]">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[9px]">
            Enter
          </kbd>{" "}
          to send · {currentTypeOption.direction === "internal" ? "Internal only" : `Sent as ${currentTypeOption.label}`}
        </p>
      </div>
    </div>
  );
}
