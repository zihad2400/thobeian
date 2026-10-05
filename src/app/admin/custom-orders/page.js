"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Scissors,
  Eye,
  Loader2,
  Search,
  Calendar,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminCustomOrdersPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data } = await axios.get("/api/admin/custom-orders");
      setDesigns(data.data.designs || []);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const filtered = designs.filter((d) =>
    search
      ? d.designId?.toLowerCase().includes(search.toLowerCase()) ||
        d.user?.name?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gold mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
          Custom Thobe Orders
        </h1>
        <p className="text-sm text-text-muted mt-2">
          {designs.length} custom designs from customers
        </p>
      </div>

      <div className="bg-white border border-border p-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by design ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-gold outline-none text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-border p-12 text-center">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <Scissors size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">No custom designs yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((design) => (
            <div
              key={design._id}
              className="bg-white border border-border p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Design ID
                  </p>
                  <p className="font-mono text-sm text-charcoal font-medium">
                    {design.designId}
                  </p>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(design.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">
                    Price
                  </p>
                  <p className="font-serif text-lg text-charcoal">
                    {formatPrice(design.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
                <ConfigItem label="Fabric" value={design.config?.fabric} />
                <ConfigItem label="Color" value={design.config?.fabricColor} />
                <ConfigItem label="Collar" value={design.config?.collarType} />
                <ConfigItem label="Fit" value={design.config?.fit} />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-muted">
                  Customer:{" "}
                  <span className="text-charcoal">
                    {design.user?.name || "Guest"}
                  </span>
                </p>
                <Link
                  href={`/custom-thobe?design=${design.designId}`}
                  target="_blank"
                  className="btn-outline text-xs py-2 px-3 flex items-center gap-1"
                >
                  <Eye size={12} /> View Design
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfigItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="p-2 bg-background-luxury border border-border">
      <p className="text-[9px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
      <p className="text-xs text-charcoal font-medium capitalize truncate">
        {value}
      </p>
    </div>
  );
}
