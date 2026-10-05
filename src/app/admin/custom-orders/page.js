"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Scissors,
  Eye,
  Loader2,
  Search,
  Calendar,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  Ruler,
  Palette,
  Shirt,
  Layers3,
  CircleDollarSign,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Hash,
  Sparkles,
  Package,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminCustomOrdersPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/admin/custom-orders");

      setDesigns(data?.data?.designs || []);
    } catch (error) {
      console.error("Load custom designs error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load custom thobe orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (design) => {
    if (!design?.designId) return;

    const confirmed = window.confirm(
      `Delete custom thobe "${design.designId}"?\n\nThis will permanently remove this saved custom design from the database.`
    );

    if (!confirmed) return;

    try {
      setDeleting(design.designId);

      const { data } = await axios.delete(
        "/api/admin/custom-orders",
        {
          data: {
            designId: design.designId,
          },
        }
      );

      setDesigns((current) =>
        current.filter(
          (item) => item.designId !== design.designId
        )
      );

      if (
        selectedDesign?.designId === design.designId
      ) {
        setSelectedDesign(null);
      }

      toast.success(
        data?.message ||
          "Custom thobe deleted successfully"
      );
    } catch (error) {
      console.error("Delete custom design error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete custom thobe"
      );
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return designs;

    return designs.filter((design) => {
      const searchable = [
        design.designId,
        design.name,
        design.user?.name,
        design.user?.email,
        design.user?.phone,
        design.config?.fabric,
        design.config?.fabricColor,
        design.config?.color,
        design.config?.collarType,
        design.config?.collar,
        design.config?.fit,
        design.config?.size,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [designs, search]);

  return (
    <div className="pb-10">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-gold" />

              <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
                Admin • Custom Atelier
              </p>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
              Custom Thobe Orders
            </h1>

            <p className="text-sm text-text-muted mt-2 max-w-2xl">
              Review complete customer-made thobe designs,
              configurations, measurements, previews and pricing.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-white border border-border">
            <p className="text-[9px] uppercase tracking-widest text-text-muted">
              Total Designs
            </p>

            <p className="text-xl font-serif text-charcoal mt-0.5">
              {designs.length}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH / REFRESH */}
      <div className="bg-white border border-border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              placeholder="Search design ID, customer, fabric, color, size..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:border-gold focus:ring-1 focus:ring-gold/20 outline-none text-sm bg-background-luxury"
            />
          </div>

          <button
            onClick={fetchDesigns}
            disabled={loading}
            className="btn-outline text-xs py-3 px-5 flex items-center justify-center gap-2 rounded-xl disabled:opacity-50"
          >
            <Loader2
              size={14}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          searching={Boolean(search.trim())}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((design) => (
            <CustomDesignCard
              key={design._id}
              design={design}
              deleting={
                deleting === design.designId
              }
              onView={() =>
                setSelectedDesign(design)
              }
              onDelete={() =>
                handleDelete(design)
              }
            />
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedDesign && (
        <DesignDetailsModal
          design={selectedDesign}
          copied={copied}
          onCopy={async () => {
            try {
              await navigator.clipboard.writeText(
                selectedDesign.designId
              );

              setCopied(true);

              setTimeout(
                () => setCopied(false),
                1600
              );
            } catch {
              toast.error("Unable to copy design ID");
            }
          }}
          onClose={() => {
            setSelectedDesign(null);
            setCopied(false);
          }}
          onDelete={() =>
            handleDelete(selectedDesign)
          }
          deleting={
            deleting === selectedDesign.designId
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   DESIGN CARD
========================================================= */

function CustomDesignCard({
  design,
  deleting,
  onView,
  onDelete,
}) {
  const config = design.config || {};

  const customerName =
    design.user?.name || "Guest Customer";

  const preview =
    design.previewImage ||
    config.previewImage ||
    config.preview ||
    null;

  return (
    <div className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* PREVIEW */}
          <div className="w-full lg:w-36 shrink-0">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-background-luxury border border-border">
              {preview ? (
                <img
                  src={preview}
                  alt={design.name || "Custom Thobe"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                  <Shirt size={28} />
                  <span className="text-[9px] uppercase tracking-widest mt-2">
                    No Preview
                  </span>
                </div>
              )}

              <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-charcoal/80 text-white text-[8px] uppercase tracking-widest backdrop-blur-sm">
                Custom
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold mb-1">
                  Design ID
                </p>

                <p className="font-mono text-sm font-semibold text-charcoal truncate">
                  {design.designId}
                </p>

                <p className="text-sm text-text-secondary mt-1 truncate">
                  {design.name || "My Custom Thobe"}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[9px] uppercase tracking-widest text-text-muted">
                  Total
                </p>

                <p className="font-serif text-xl text-charcoal">
                  {formatPrice(
                    design.totalPrice || 0
                  )}
                </p>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <User size={12} />
                {customerName}
              </span>

              {design.user?.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={12} />
                  {design.user.phone}
                </span>
              )}

              {design.user?.email && (
                <span className="inline-flex items-center gap-1.5 truncate max-w-[260px]">
                  <Mail size={12} />
                  {design.user.email}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(design.createdAt)}
              </span>
            </div>

            {/* CONFIG SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <SummaryItem
                icon={Layers3}
                label="Fabric"
                value={firstValue(
                  config.fabric,
                  config.fabricType
                )}
              />

              <SummaryItem
                icon={Palette}
                label="Color"
                value={firstValue(
                  config.fabricColor,
                  config.color
                )}
              />

              <SummaryItem
                icon={Shirt}
                label="Collar"
                value={firstValue(
                  config.collarType,
                  config.collar
                )}
              />

              <SummaryItem
                icon={Ruler}
                label="Size / Fit"
                value={firstValue(
                  config.size,
                  config.fit
                )}
              />
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                design.isOrdered
                  ? "bg-success"
                  : "bg-warning"
              }`}
            />

            <span className="text-[10px] uppercase tracking-widest text-text-muted">
              {design.isOrdered
                ? "Ordered"
                : "Saved Design"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onView}
              className="btn-outline text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
            >
              <Eye size={14} />
              Full Details
            </button>

            <a
              href={`/custom-thobe?design=${encodeURIComponent(
                design.designId
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs py-2.5 px-4 rounded-xl border border-border hover:border-gold/50 transition-colors text-text-secondary hover:text-charcoal"
            >
              Preview
            </a>

            <button
              onClick={onDelete}
              disabled={deleting}
              title="Delete custom design"
              className="w-10 h-10 rounded-xl border border-error/20 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {deleting ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function DesignDetailsModal({
  design,
  copied,
  onCopy,
  onClose,
  onDelete,
  deleting,
}) {
  const config = design.config || {};

  const preview =
    design.previewImage ||
    config.previewImage ||
    config.preview ||
    null;

  const customerName =
    design.user?.name || "Guest Customer";

  const entries = Object.entries(config).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      ![
        "previewImage",
        "preview",
      ].includes(key)
  );

  const measurementKeys = [
    "height",
    "chest",
    "waist",
    "shoulder",
    "sleeve",
    "neck",
    "length",
    "armhole",
    "hip",
    "wrist",
    "bicep",
  ];

  const measurements = measurementKeys
    .filter(
      (key) =>
        config.measurements?.[key] !==
          undefined &&
        config.measurements?.[key] !== null &&
        config.measurements?.[key] !== ""
    )
    .map((key) => [
      key,
      config.measurements[key],
    ]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* BACKDROP */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm cursor-default"
      />

      {/* MODAL */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl max-h-[94vh] overflow-hidden bg-background-luxury rounded-3xl shadow-2xl border border-border flex flex-col">
          {/* MODAL HEADER */}
          <div className="px-5 sm:px-7 py-4 bg-white border-b border-border flex items-center justify-between gap-4 shrink-0">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
                Custom Thobe • Admin View
              </p>

              <div className="flex items-center gap-2 mt-1">
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal truncate">
                  {design.name ||
                    "Custom Thobe Design"}
                </h2>

                <button
                  onClick={onCopy}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-background-luxury text-text-muted hover:text-charcoal"
                  title="Copy Design ID"
                >
                  {copied ? (
                    <Check
                      size={14}
                      className="text-success"
                    />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 shrink-0 rounded-xl border border-border hover:border-charcoal/30 flex items-center justify-center text-text-muted hover:text-charcoal transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* MODAL BODY */}
          <div className="overflow-y-auto p-4 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              {/* LEFT */}
              <div>
                <div className="bg-white border border-border rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] bg-background-luxury">
                    {preview ? (
                      <img
                        src={preview}
                        alt={
                          design.name ||
                          "Custom Thobe Preview"
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-text-muted">
                        <ImageIcon size={40} />
                        <p className="text-[10px] uppercase tracking-widest mt-3">
                          Preview unavailable
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-[9px] uppercase tracking-widest text-text-muted">
                      Design ID
                    </p>

                    <p className="font-mono text-xs text-charcoal mt-1 break-all">
                      {design.designId}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                      <Calendar size={12} />
                      {formatDate(design.createdAt)}
                    </div>
                  </div>
                </div>

                {/* PRICE */}
                <div className="mt-3 bg-charcoal text-white rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-white/60">
                    <CircleDollarSign size={15} />
                    <span className="text-[9px] uppercase tracking-[0.2em]">
                      Total Price
                    </span>
                  </div>

                  <p className="font-serif text-3xl mt-2">
                    {formatPrice(
                      design.totalPrice || 0
                    )}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                {/* CUSTOMER */}
                <Section
                  icon={User}
                  title="Customer Information"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoBox
                      icon={User}
                      label="Name"
                      value={customerName}
                    />

                    <InfoBox
                      icon={Phone}
                      label="Phone"
                      value={
                        design.user?.phone ||
                        "Guest / Not available"
                      }
                    />

                    <InfoBox
                      icon={Mail}
                      label="Email"
                      value={
                        design.user?.email ||
                        "Guest / Not available"
                      }
                    />
                  </div>
                </Section>

                {/* MAIN CONFIG */}
                <Section
                  icon={Sparkles}
                  title="Complete Customization"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {entries
                      .filter(
                        ([key]) =>
                          key !== "measurements" &&
                          key !== "specialRequest" &&
                          key !== "customNotes" &&
                          key !== "notes"
                      )
                      .map(([key, value]) => (
                        <ConfigDetail
                          key={key}
                          label={formatLabel(key)}
                          value={formatValue(value)}
                        />
                      ))}
                  </div>
                </Section>

                {/* MEASUREMENTS */}
                {measurements.length > 0 && (
                  <Section
                    icon={Ruler}
                    title="Measurements"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {measurements.map(
                        ([key, value]) => (
                          <ConfigDetail
                            key={key}
                            label={formatLabel(key)}
                            value={`${value}`}
                          />
                        )
                      )}
                    </div>
                  </Section>
                )}

                {/* NOTES */}
                {(config.specialRequest ||
                  config.customNotes ||
                  config.notes ||
                  design.notes) && (
                  <Section
                    icon={FileText}
                    title="Customer Notes / Special Request"
                  >
                    <div className="p-4 bg-white border border-border rounded-xl">
                      <p className="text-sm text-charcoal whitespace-pre-wrap leading-6">
                        {config.specialRequest ||
                          config.customNotes ||
                          config.notes ||
                          design.notes}
                      </p>
                    </div>
                  </Section>
                )}

                {/* RAW CONFIG */}
                <details className="bg-white border border-border rounded-2xl overflow-hidden">
                  <summary className="cursor-pointer px-4 py-3 text-xs uppercase tracking-widest text-text-muted hover:text-charcoal">
                    Technical Configuration Data
                  </summary>

                  <pre className="p-4 overflow-x-auto text-[10px] leading-5 bg-charcoal text-white">
                    {JSON.stringify(
                      config,
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="px-5 sm:px-7 py-4 bg-white border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-[10px] text-text-muted">
              Admin-only management • Permanent deletion
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-border text-xs text-text-secondary hover:text-charcoal hover:border-charcoal/30"
              >
                Close
              </button>

              <button
                onClick={onDelete}
                disabled={deleting}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-error text-white text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={14} />
                )}

                Delete Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-background-luxury border border-border min-w-0">
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon size={12} />

        <p className="text-[8px] uppercase tracking-widest">
          {label}
        </p>
      </div>

      <p className="text-xs text-charcoal font-medium mt-1 truncate capitalize">
        {value || "—"}
      </p>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="p-3 bg-background-luxury border border-border rounded-xl">
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon size={12} />

        <p className="text-[8px] uppercase tracking-widest">
          {label}
        </p>
      </div>

      <p className="text-xs text-charcoal font-medium mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function ConfigDetail({
  label,
  value,
}) {
  return (
    <div className="p-3 bg-background-luxury border border-border rounded-xl">
      <p className="text-[8px] uppercase tracking-[0.16em] text-text-muted">
        {label}
      </p>

      <p className="text-xs text-charcoal font-medium mt-1 break-words capitalize">
        {value || "—"}
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
          <Icon size={14} />
        </div>

        <h3 className="text-xs uppercase tracking-[0.16em] text-charcoal font-medium">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="bg-white border border-border rounded-2xl p-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
        <Loader2
          size={24}
          className="animate-spin text-gold"
        />
      </div>

      <p className="text-sm text-charcoal">
        Loading custom thobe designs...
      </p>

      <p className="text-xs text-text-muted mt-1">
        Please wait
      </p>
    </div>
  );
}

function EmptyState({ searching }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-background-luxury border border-border flex items-center justify-center mx-auto mb-5">
        {searching ? (
          <Search
            size={26}
            className="text-text-muted"
          />
        ) : (
          <Scissors
            size={26}
            className="text-text-muted"
          />
        )}
      </div>

      <p className="text-sm text-charcoal">
        {searching
          ? "No matching custom designs"
          : "No custom thobe designs yet"}
      </p>

      <p className="text-xs text-text-muted mt-1">
        {searching
          ? "Try another search term."
          : "Customer-created designs will appear here."}
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function firstValue(...values) {
  return (
    values.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    ) || ""
  );
}

function formatLabel(key) {
  if (!key) return "";

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) =>
      char.toUpperCase()
    );
}

function formatValue(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item))
      .join(", ");
  }

  if (
    typeof value === "object"
  ) {
    return Object.entries(value)
      .map(
        ([key, item]) =>
          `${formatLabel(key)}: ${formatValue(item)}`
      )
      .join(" • ");
  }

  return String(value);
}
