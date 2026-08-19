"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Plus, Send, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";

interface Template {
  _id: string;
  name: string;
  category: string;
  channel: string;
  body: string;
  isSeed: number;
  createdAt: string;
  updatedAt: string;
}

const FILTERS = ["All", "Sales", "Service", "Reviews", "Reminders", "General"];

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const highlightMergeTags = (text: string) => {
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) =>
    part.startsWith("{{") ? (
      <span key={i} className="font-semibold text-blue-600">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
};

export default function TemplatesLibraryPage() {
  const router = useRouter();

  // List state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    category: "general",
    channel: "sms",
    body: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit modal state
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    channel: "",
    body: "",
  });
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch list ──────────────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async (filter: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query =
        filter !== "All" ? `?category=${filter.toLowerCase()}` : "";
      const res = await fetch(`${API_URL}/templates${query}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplates(data.data || []);
      } else {
        setError(data.message || "Failed to fetch templates");
      }
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates(activeFilter);
  }, [activeFilter, fetchTemplates]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      setCreateError("Template name is required.");
      return;
    }
    if (!createForm.body.trim()) {
      setCreateError("Message body is required.");
      return;
    }
    setCreateError(null);
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/templates`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: createForm.name.trim(),
          category: createForm.category,
          channel: createForm.channel,
          body: createForm.body.trim(),
          isSeed: 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplates((prev) => [data.data, ...prev]);
        setIsCreateOpen(false);
        setCreateForm({ name: "", category: "general", channel: "sms", body: "" });
      } else {
        setCreateError(data.message || "Failed to create template.");
      }
    } catch {
      setCreateError("Unable to reach the server.");
    } finally {
      setIsCreating(false);
    }
  };

  // ── Open Edit (GET by ID) ───────────────────────────────────────────────────
  const handleOpenEdit = async (template: Template) => {
    setEditTemplate(template);
    setEditForm({
      name: template.name,
      category: template.category,
      channel: template.channel,
      body: template.body,
    });
    setEditError(null);
    setIsLoadingEdit(true);
    try {
      const res = await fetch(`${API_URL}/templates/${template._id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const t: Template = data.data;
        setEditTemplate(t);
        setEditForm({
          name: t.name,
          category: t.category,
          channel: t.channel,
          body: t.body,
        });
      }
    } catch {
      // keep local data as fallback
    } finally {
      setIsLoadingEdit(false);
    }
  };

  // ── Update (PUT) ────────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplate) return;
    if (!editForm.name.trim()) {
      setEditError("Template name is required.");
      return;
    }
    if (!editForm.body.trim()) {
      setEditError("Message body is required.");
      return;
    }
    setEditError(null);
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/templates/${editTemplate._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: editForm.name.trim(),
          category: editForm.category,
          channel: editForm.channel,
          body: editForm.body.trim(),
          isSeed: editTemplate.isSeed,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplates((prev) =>
          prev.map((t) => (t._id === editTemplate._id ? data.data : t))
        );
        setEditTemplate(null);
      } else {
        setEditError(data.message || "Failed to update template.");
      }
    } catch {
      setEditError("Unable to reach the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/templates/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        setDeleteTarget(null);
      }
    } catch {
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Shared form fields ──────────────────────────────────────────────────────
  const CategorySelect = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
    >
      <option value="general">General</option>
      <option value="sales">Sales</option>
      <option value="service">Service</option>
      <option value="reviews">Reviews</option>
      <option value="reminders">Reminders</option>
    </select>
  );

  const ChannelSelect = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
    >
      <option value="sms">SMS</option>
      <option value="email">Email</option>
    </select>
  );

  const MergeTagsRef = ({ onInsert }: { onInsert: (tag: string) => void }) => (
    <div>
      <div className="flex flex-wrap gap-2">
        {["{{first_name}}", "{{name}}", "{{vehicle}}", "{{dealership}}", "{{review_link}}"].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onInsert(tag)}
              className="inline-flex bg-white border border-neutral-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-neutral-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors"
            >
              {tag}
            </button>
          )
        )}
      </div>
    </div>
  );

  const MOCK_DATA: Record<string, string> = {
    "{{first_name}}": "Sarah",
    "{{last_name}}": "Mitchell",
    "{{name}}": "Sarah Mitchell",
    "{{vehicle}}": "Toyota RAV4",
    "{{dealership}}": "Good Showroom",
    "{{review_link}}": "g.page/r/gs-demo-review",
  };

  const PreviewBox = ({ body }: { body: string }) => {
    let previewText = body;
    Object.keys(MOCK_DATA).forEach((tag) => {
      previewText = previewText.replaceAll(tag, MOCK_DATA[tag]);
    });
    const chars = previewText.length;
    const segments = Math.ceil(chars / 160) || 1;

    return (
      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 mt-4">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
          Preview (Sarah Mitchell)
        </p>
        <p className="text-sm text-neutral-900 mb-3 whitespace-pre-wrap break-words">
          {previewText || <span className="text-neutral-400 italic">Type a message to see preview...</span>}
        </p>
        <div className="text-[11px] text-neutral-500">
          {chars} chars · {segments} segment{segments !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
            Message Library
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Templates</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Reusable messages with merge tags — one click from any thread or
            bulk send.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => router.push("/operations/bulk-sms")}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
          >
            <Send className="h-4 w-4" />
            Bulk send
          </button>
          <button
            onClick={() => {
              setIsCreateOpen(true);
              setCreateError(null);
            }}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New template
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${activeFilter === filter
              ? filter === "All"
                ? "bg-rose-600 text-white"
                : "bg-neutral-200 text-neutral-800"
              : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-neutral-400 text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading templates…
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="h-10 w-10 text-neutral-200 mb-4" />
          <p className="text-sm font-semibold text-neutral-500">
            No templates in this category
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Create a new template to get started.
          </p>
        </div>
      ) : (
        /* Template Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template._id}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                    <MessageSquare className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      {template.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mt-0.5">
                      {template.category} · {template.channel}
                    </p>
                  </div>
                </div>
                {template.isSeed === 1 && (
                  <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-bold text-neutral-500">
                    Starter
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex-1 px-4 pb-3">
                <p className="text-[13px] text-neutral-700 leading-relaxed">
                  {highlightMergeTags(template.body)}
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2.5">
                <span className="text-[11px] text-neutral-400">
                  {template.body.length} chars
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(template)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
                    title="Edit template"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(template)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 transition-colors text-neutral-400 hover:text-rose-500"
                    title="Delete template"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Modal ──────────────────────────────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="flex items-start justify-between px-6 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">New template</h2>
                <p className="text-xs text-neutral-500 mt-1">Merge tags personalise each message automatically.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors -mr-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Template name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Template name"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Category
                    </label>
                    <CategorySelect
                      value={createForm.category}
                      onChange={(v) =>
                        setCreateForm({ ...createForm, category: v })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Channel
                    </label>
                    <ChannelSelect
                      value={createForm.channel}
                      onChange={(v) =>
                        setCreateForm({ ...createForm, channel: v })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    placeholder="Hi {{first_name}}, ..."
                    value={createForm.body}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, body: e.target.value })
                    }
                    rows={5}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                  />
                </div>

                <MergeTagsRef
                  onInsert={(tag) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      body: prev.body + (prev.body.endsWith(" ") || prev.body.length === 0 ? "" : " ") + tag,
                    }))
                  }
                />

                <PreviewBox body={createForm.body} />

                {createError && (
                  <p className="text-sm text-red-600">{createError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                >
                  {isCreating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="flex items-start justify-between px-6 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Edit template</h2>
                <p className="text-xs text-neutral-500 mt-1">Merge tags personalise each message automatically.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditTemplate(null)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors -mr-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingEdit ? (
              <div className="flex items-center justify-center gap-2 py-12 text-neutral-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Template name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Category
                      </label>
                      <CategorySelect
                        value={editForm.category}
                        onChange={(v) =>
                          setEditForm({ ...editForm, category: v })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Channel
                      </label>
                      <ChannelSelect
                        value={editForm.channel}
                        onChange={(v) =>
                          setEditForm({ ...editForm, channel: v })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={editForm.body}
                      onChange={(e) =>
                        setEditForm({ ...editForm, body: e.target.value })
                      }
                      rows={5}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                    />
                  </div>

                  <MergeTagsRef
                    onInsert={(tag) =>
                      setEditForm((prev) => ({
                        ...prev,
                        body: prev.body + (prev.body.endsWith(" ") || prev.body.length === 0 ? "" : " ") + tag,
                      }))
                    }
                  />

                  <PreviewBox body={editForm.body} />

                  {editError && (
                    <p className="text-sm text-red-600">{editError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setEditTemplate(null)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                  >
                    {isUpdating && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Save changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-neutral-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 text-center">
              Delete Template?
            </h3>
            <p className="text-sm text-neutral-500 text-center mt-1 mb-5">
              &ldquo;{deleteTarget.name}&rdquo; will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
