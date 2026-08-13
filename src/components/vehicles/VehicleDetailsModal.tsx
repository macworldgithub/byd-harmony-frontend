import { Modal } from "@/components/ui/Modal";
import { Car, UserCircle2, Calendar, Shield, MapPin, Hash, Palette, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VehicleStatus } from "./VehicleModal";

const statusTone: Record<VehicleStatus, "green" | "orange" | "blue" | "neutral" | "red"> = {
  active: "green",
  disposed: "neutral",
  traded: "blue",
  written_off: "red",
};

const statusLabel: Record<VehicleStatus, string> = {
  active: "Active",
  disposed: "Disposed",
  traded: "Traded",
  written_off: "Written Off",
};

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any | null;
}

export function VehicleDetailsModal({ isOpen, onClose, vehicle }: VehicleDetailsModalProps) {
  if (!vehicle) return null;

  const getCustomerDisplay = () => {
    const c = vehicle.customerId || vehicle.customer;
    if (!c) return "No customer assigned";
    if (typeof c === "string") return `ID: ${c}`;
    if (typeof c === "object") {
      const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{name || c.name || "Unknown Name"}</span>
          {c.email && <span className="text-neutral-500">{c.email}</span>}
          {c.phone && <span className="text-neutral-500">{c.phone}</span>}
        </div>
      );
    }
    return "Unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle Details"
      subtitle="Complete information for this vehicle"
      headerIcon={<Car className="h-5 w-5" />}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header summary */}
        <div className="flex items-center justify-between rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm font-mono text-neutral-500 mt-1">
              VIN: <span className="text-neutral-700">{vehicle.vin}</span>
            </p>
          </div>
          <Badge tone={vehicle.status ? (statusTone[vehicle.status as VehicleStatus] || "neutral") : "neutral"} size="lg">
            {vehicle.status ? (statusLabel[vehicle.status as VehicleStatus] || vehicle.status) : "Unknown"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Car className="h-4 w-4 text-violet-500" />
              General Information
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <InfoItem label="Registration" value={vehicle.rego} icon={<Hash className="h-3.5 w-3.5" />} />
              <InfoItem label="Colour" value={vehicle.colour || "N/A"} icon={<Palette className="h-3.5 w-3.5" />} />
              <InfoItem label="Odometer" value={vehicle.odometer != null ? `${vehicle.odometer} km` : "N/A"} icon={<MapPin className="h-3.5 w-3.5" />} />
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
              <UserCircle2 className="h-4 w-4 text-violet-500" />
              Customer
            </h4>
            <div className="text-sm">
              {getCustomerDisplay()}
            </div>
          </div>
        </div>

        {/* Dates Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Calendar className="h-4 w-4 text-violet-500" />
            Important Dates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <InfoItem label="Delivered At" value={formatDate(vehicle.deliveredAt)} />
            <InfoItem label="Next Service Due" value={formatDate(vehicle.nextServiceDue)} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
            <InfoItem label="Warranty Expiry" value={formatDate(vehicle.warrantyExpiry)} icon={<Shield className="h-3.5 w-3.5" />} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-xs text-neutral-500 mb-0.5">
        {icon && <span className="text-neutral-400">{icon}</span>}
        {label}
      </span>
      <span className="font-medium text-neutral-900">{value || "—"}</span>
    </div>
  );
}
