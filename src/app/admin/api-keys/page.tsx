"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { ShoppingCart, Wrench, Truck, Shield, Globe, Copy, ExternalLink, Plus, Key, Calendar } from "lucide-react";
import { apiBaseUrl, apiScopes } from "@/lib/data/admin-overview";
import { AddApiKeyModal } from "@/components/api-keys/AddApiKeyModal";
import { ApiKeyDetailModal, ApiKeyDetail } from "@/components/api-keys/ApiKeyDetailModal";
import { EditApiKeyModal } from "@/components/api-keys/EditApiKeyModal";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/Badge";

const scopeIcons: Record<string, React.ElementType> = {
  Sales: ShoppingCart,
  Service: Wrench,
  Delivery: Truck,
  Admin: Shield,
};

const scopeColors: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  orange: "bg-orange-50 border-orange-200 text-orange-800",
  green: "bg-emerald-50 border-emerald-200 text-emerald-800",
  purple: "bg-purple-50 border-purple-200 text-purple-800",
};

const scopeIconColors: Record<string, string> = {
  blue: "text-blue-500",
  orange: "text-orange-500",
  green: "text-emerald-500",
  purple: "text-purple-500",
};

interface ApiKeyData {
  _id: string;
  name: string;
  keyPrefix: string;
  role?: string;
  locationId?: string;
  department?: string;
  isActive: boolean;
  scopes?: string[];
  retryStrategy?: string;
  maxRetries?: number;
  createdAt: string;
}

export default function AdminApiKeysPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Details Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApiKeyForEdit, setSelectedApiKeyForEdit] = useState<ApiKeyDetail | null>(null);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api-keys`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setApiKeys(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRowClick = (id: string) => {
    setSelectedApiKeyId(id);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (apiKey: ApiKeyDetail) => {
    setIsDetailModalOpen(false);
    setSelectedApiKeyForEdit(apiKey);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Manage API keys for external role-based applications."
        action={
          <div className="flex items-center gap-3">
            <a
              href={`${apiBaseUrl.replace("/v1", "")}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              API Docs
            </a>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create API Key
            </button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* REST API Base URL */}
        <Panel>
          <PanelHeader title="REST API Base URL" />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-4 w-4 shrink-0 text-neutral-400" />
              <code className="truncate text-sm font-mono text-neutral-700">{apiBaseUrl}</code>
            </div>
            <button className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors">
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </button>
          </div>
        </Panel>

        {/* API Scopes */}
        <Panel>
          <PanelHeader title="Available Scopes" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {apiScopes.map((scope) => {
              const Icon = scopeIcons[scope.label] ?? Shield;
              return (
                <div
                  key={scope.id}
                  className={`rounded-xl border p-4 ${scopeColors[scope.color]}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`h-4 w-4 ${scopeIconColors[scope.color]}`} />
                    <p className="text-sm font-semibold">{scope.label}</p>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">{scope.description}</p>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* API Keys Table */}
        <Panel>
          <PanelHeader title="Active API Keys" />
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Prefix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Role / Dept
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">
                        Loading API keys...
                      </td>
                    </tr>
                  ) : apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">
                        No API keys found. Click &quot;Create API Key&quot; to add one.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr 
                        key={key._id} 
                        className="hover:bg-neutral-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(key._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                              <Key className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-neutral-900">{key.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2 py-1 rounded">{key.keyPrefix}...</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {key.role && (
                              <span className="text-xs text-neutral-600">Role: <span className="font-semibold capitalize">{key.role}</span></span>
                            )}
                            {key.department && (
                              <span className="text-xs text-neutral-600">Dept: <span className="font-semibold capitalize">{key.department}</span></span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge tone={key.isActive ? "green" : "neutral"}>
                            {key.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(key.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      </div>

      <AddApiKeyModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => fetchApiKeys()}
      />

      <ApiKeyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApiKeyId(null);
        }}
        apiKeyId={selectedApiKeyId}
        onEdit={handleEditClick}
        onDeleted={(id) => {
          setApiKeys((prev) => prev.filter((k) => k._id !== id));
        }}
      />
      
      <EditApiKeyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedApiKeyForEdit(null);
        }}
        apiKey={selectedApiKeyForEdit}
        onSuccess={() => {
          fetchApiKeys();
        }}
      />
    </div>
  );
}
