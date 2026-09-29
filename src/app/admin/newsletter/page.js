"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Mail,
  Search,
  Download,
  Loader2,
  Users,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get("/api/admin/newsletter");
      setSubscribers(data.data.subscribers || []);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subscriber?")) return;
    try {
      await axios.delete(`/api/admin/newsletter/${id}`);
      toast.success("Deleted");
      fetchSubscribers();
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Email", "Source", "Date"].join(","),
      ...subscribers.map((s) =>
        [s.email, s.source || "footer", s.createdAt].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${Date.now()}.csv`;
    a.click();
    toast.success("CSV downloaded");
  };

  const filtered = subscribers.filter((s) =>
    search ? s.email?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Newsletter
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {subscribers.length} subscribers
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border p-5">
          <Users size={20} className="text-gold mb-3" />
          <p className="font-serif text-3xl text-charcoal mb-1">
            {subscribers.length}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            Total Subscribers
          </p>
        </div>
        <div className="bg-white border border-border p-5">
          <Mail size={20} className="text-success mb-3" />
          <p className="font-serif text-3xl text-success mb-1">
            {subscribers.filter((s) => s.isActive !== false).length}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            Active
          </p>
        </div>
      </div>

      <div className="bg-white border border-border p-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by email..."
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
          <Mail size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">No subscribers</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-luxury border-b border-border">
              <tr>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Email
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  Source
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Status
                </th>
                <th className="text-right p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b border-border hover:bg-background-luxury"
                >
                  <td className="p-4 text-sm text-charcoal">{sub.email}</td>
                  <td className="p-4 text-xs text-text-muted capitalize hidden md:table-cell">
                    {sub.source || "footer"}
                  </td>
                  <td className="p-4 text-xs text-text-muted hidden md:table-cell">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                        sub.isActive !== false
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-border text-text-muted"
                      }`}
                    >
                      {sub.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="p-2 text-text-muted hover:text-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
