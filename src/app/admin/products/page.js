"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Loader2,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/products");
      setProducts(data.data.products || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      setDeleting(id);
      await axios.delete(`/api/admin/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    search
      ? p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    outOfStock: products.filter((p) => (p.totalStock || 0) === 0).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Products
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Add, edit, or delete products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Published" value={stats.published} color="text-success" />
        <StatCard label="Draft" value={stats.draft} color="text-warning" />
        <StatCard label="Out of Stock" value={stats.outOfStock} color="text-error" />
      </div>

      {/* Search */}
      <div className="bg-white border border-border p-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-gold outline-none text-sm"
          />
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="bg-white border border-border p-12 text-center">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <Package size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">No products found</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-luxury border-b border-border">
              <tr>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Product
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  SKU
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Price
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  Stock
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden lg:table-cell">
                  Status
                </th>
                <th className="text-right p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border hover:bg-background-luxury transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-12 h-14 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-charcoal font-medium truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.featured && (
                            <span className="text-[9px] text-gold flex items-center gap-0.5">
                              <Star size={9} className="fill-gold" /> Featured
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="text-[9px] text-gold">Bestseller</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-text-muted font-mono hidden md:table-cell">
                    {product.sku || "—"}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-charcoal font-medium">
                      {formatPrice(product.price)}
                    </p>
                    {product.compareAtPrice && (
                      <p className="text-[10px] text-text-muted line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span
                      className={`text-xs ${
                        (product.totalStock || 0) === 0
                          ? "text-error"
                          : (product.totalStock || 0) < 5
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {product.totalStock || 0} units
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                        product.status === "published"
                          ? "bg-success/10 text-success border-success/30"
                          : product.status === "draft"
                          ? "bg-warning/10 text-warning border-warning/30"
                          : "bg-border text-text-muted"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-2 text-text-muted hover:text-gold"
                        title="View"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="p-2 text-text-muted hover:text-gold"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className="p-2 text-text-muted hover:text-error disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === product._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
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

function StatCard({ label, value, color = "text-charcoal" }) {
  return (
    <div className="bg-white border border-border p-5">
      <p className={`font-serif text-2xl ${color} mb-1`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </div>
  );
}
