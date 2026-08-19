"use client";

import { useState, useEffect } from "react";
import { Panel } from "@/components/dashboard/Panel";
import { Loader2, Bell, CheckCircle2, Circle, Trash2, Plus, X, Edit2 } from "lucide-react";
import { API_URL } from "@/lib/config";

interface Reminder {
  _id: string;
  clientId: string | null;
  clientName: string;
  title: string;
  dueAt: string;
  done: number;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isOverdue = date < now;
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { formatted, isOverdue };
}

export default function SalesRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewReminder, setShowNewReminder] = useState(false);

  // Create form state
  const [formTitle, setFormTitle] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formDueAt, setFormDueAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit modal state
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueAt, setEditDueAt] = useState("");
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReminders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/reminders`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, limit: 20 });
      } else {
        setError(data.message || "Failed to fetch reminders");
      }
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggleDone = async (reminder: Reminder) => {
    const newDone = reminder.done === 1 ? 0 : 1;
    // Optimistic update
    setReminders((prev) =>
      prev.map((r) => (r._id === reminder._id ? { ...r, done: newDone } : r))
    );
    try {
      const res = await fetch(`${API_URL}/reminders/${reminder._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          clientId: reminder.clientId,
          clientName: reminder.clientName,
          title: reminder.title,
          dueAt: reminder.dueAt,
          done: newDone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === reminder._id ? data.data : r))
        );
      } else {
        // Revert on API error
        setReminders((prev) =>
          prev.map((r) =>
            r._id === reminder._id ? { ...r, done: reminder.done } : r
          )
        );
      }
    } catch {
      // Revert on network failure
      setReminders((prev) =>
        prev.map((r) =>
          r._id === reminder._id ? { ...r, done: reminder.done } : r
        )
      );
    }
  };

  // Fetch single reminder by ID and open edit modal
  const handleOpenEdit = async (reminder: Reminder) => {
    setEditReminder(reminder);
    setEditTitle(reminder.title);
    // Convert ISO to datetime-local format (YYYY-MM-DDTHH:mm)
    const local = new Date(reminder.dueAt);
    const offset = local.getTimezoneOffset();
    const adjusted = new Date(local.getTime() - offset * 60000);
    setEditDueAt(adjusted.toISOString().slice(0, 16));
    setEditError(null);
    setIsLoadingEdit(true);
    try {
      const res = await fetch(`${API_URL}/reminders/${reminder._id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const r: Reminder = data.data;
        setEditReminder(r);
        setEditTitle(r.title);
        const loc = new Date(r.dueAt);
        const off = loc.getTimezoneOffset();
        const adj = new Date(loc.getTime() - off * 60000);
        setEditDueAt(adj.toISOString().slice(0, 16));
      }
    } catch {
      // Keep the locally known data as fallback
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReminder) return;
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      return;
    }
    if (!editDueAt) {
      setEditError("Due date is required.");
      return;
    }
    setEditError(null);
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/reminders/${editReminder._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          clientId: editReminder.clientId,
          clientName: editReminder.clientName,
          title: editTitle.trim(),
          dueAt: new Date(editDueAt).toISOString(),
          done: editReminder.done,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === editReminder._id ? data.data : r))
        );
        setEditReminder(null);
      } else {
        setEditError(data.message || "Failed to update reminder.");
      }
    } catch {
      setEditError("Unable to reach the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (reminder: Reminder) => {
    setDeleteTarget(reminder);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/reminders/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setReminders((prev) => prev.filter((r) => r._id !== deleteTarget._id));
        setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formDueAt) {
      setFormError("Due date is required.");
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          clientId: null,
          clientName: formClientName.trim() || "null",
          title: formTitle.trim(),
          dueAt: new Date(formDueAt).toISOString(),
          done: 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReminders((prev) => [data.data, ...prev]);
        setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
        setShowNewReminder(false);
        setFormTitle("");
        setFormClientName("");
        setFormDueAt("");
      } else {
        setFormError(data.message || "Failed to create reminder.");
      }
    } catch {
      setFormError("Unable to reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReminders = reminders.filter((r) => r.done !== 1);
  const overdueCount = openReminders.filter((r) => {
    const { isOverdue } = formatDueDate(r.dueAt);
    return isOverdue;
  }).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Follow-up Reminders
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isLoading
              ? "Loading…"
              : `${openReminders.length} open · ${overdueCount} overdue`}
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewReminder(true);
            setFormError(null);
          }}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* New Reminder Modal */}
      {showNewReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewReminder(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[8px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">New Reminder</h3>
              <button
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors"
                onClick={() => setShowNewReminder(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. Follow up with John Smith"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Client Name
                </label>
                <input
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. John Smith (optional)"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Due Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formDueAt}
                  onChange={(e) => setFormDueAt(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewReminder(false)}
                  className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                >
                  {isSubmitting && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Set Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Reminder Modal */}
      {editReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setEditReminder(null)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[8px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Reminder</h3>
              <button
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors"
                onClick={() => setEditReminder(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isLoadingEdit ? (
              <div className="flex items-center justify-center gap-2 py-8 text-neutral-500 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    placeholder="e.g. Follow up with John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Due Date &amp; Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editDueAt}
                    onChange={(e) => setEditDueAt(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {editError && (
                  <p className="text-sm text-red-600">{editError}</p>
                )}

                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditReminder(null)}
                    className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                  >
                    {isUpdating && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[8px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 text-center">Delete Reminder?</h3>
            <p className="text-sm text-neutral-500 text-center mt-1 mb-5">
              &ldquo;{deleteTarget.title}&rdquo; will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder List */}
      <div className="space-y-2">
        {isLoading ? (
          <Panel padded={false} className="border-neutral-200">
            <div className="flex items-center justify-center gap-2 p-8 text-neutral-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading reminders…
            </div>
          </Panel>
        ) : reminders.length === 0 ? (
          <Panel padded={false} className="border-neutral-200">
            <div className="flex flex-col items-center justify-center gap-2 p-10 text-neutral-400">
              <Bell className="h-8 w-8 opacity-30" />
              <p className="text-sm">No upcoming reminders</p>
            </div>
          </Panel>
        ) : (
          reminders.map((reminder) => {
            const { formatted, isOverdue } = formatDueDate(reminder.dueAt);
            const isDone = reminder.done === 1;

            return (
              <Panel
                key={reminder._id}
                padded={false}
                className="border-neutral-200"
              >
                <div className="flex items-center gap-4 p-4 group">
                  {/* Toggle done button */}
                  <button
                    onClick={() => handleToggleDone(reminder)}
                    className="flex-shrink-0 text-neutral-400 hover:text-rose-600 transition-colors"
                    title={isDone ? "Mark as open" : "Mark as done"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-rose-500" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-sm ${isDone
                        ? "line-through text-neutral-400"
                        : "text-neutral-900"
                        }`}
                    >
                      {reminder.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {reminder.clientName && reminder.clientName !== "null" && (
                        <>
                          <span className="text-xs text-neutral-500">
                            {reminder.clientName}
                          </span>
                          <span className="text-neutral-300 text-xs">·</span>
                        </>
                      )}
                      <span
                        className={`text-xs font-medium ${isDone
                          ? "text-neutral-400"
                          : isOverdue
                            ? "text-red-500"
                            : "text-neutral-500"
                          }`}
                      >
                        {isOverdue && !isDone ? "⚠ Overdue · " : ""}
                        {formatted}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(reminder); }}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit reminder"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(reminder); }}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Panel>
            );
          })
        )}
      </div>

      {/* Pagination info */}
      {!isLoading && meta.total > meta.limit && (
        <p className="mt-4 text-center text-xs text-neutral-400">
          Showing {reminders.length} of {meta.total} reminders
        </p>
      )}
    </div>
  );
}
