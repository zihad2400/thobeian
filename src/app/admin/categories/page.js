"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "@/lib/toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Loader2,
  Save,
  X,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    type: "thobe",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/categories");
      setCategories(data.data.categories || []);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Name required");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await axios.patch(`/api/admin/categories/${editingId}`, form);
        toast.success("Category updated");
      } else {
        await axios.post("/api/admin/categories", form);
        toast.success("Category created");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      type: cat.type || "thobe",
      isActive: cat.isActive !== false,
    });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", type: "thobe", isActive: true });
  };

  const filtered = categories.filter((c) =>
    search ? c.name?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const main = filtered.filter((c) => !c.parent);
  const subs = filtered.filter((c) => c.parent);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Categories
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {main.length} main • {subs.length} subcategories
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border p-6 mb-6 animate-slide-down"
        >
          <h3 className="font-serif text-lg text-charcoal mb-5">
            {editingId ? "Edit Category" : "New Category"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-luxury"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Slug (auto if empty)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g., premium-thobe"
                className="input-luxury"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-luxury"
              >
                <option value="thobe">Thobe</option>
                <option value="panjabi">Panjabi</option>
                <option value="fabric">Fabric</option>
                <option value="collection">Collection</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-sm text-charcoal">Active</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="input-luxury resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-5 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="bg-white border border-border p-4 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border focus:border-gold outline-none text-sm"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white border border-border p-12 text-center">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <FolderTree size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">No categories</p>
        </div>
      ) : (
        <div className="bg-white border border-border">
          <table className="w-full">
            <thead className="bg-background-luxury border-b border-border">
              <tr>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Name
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium hidden md:table-cell">
                  Type
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
              {filtered.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-border hover:bg-background-luxury"
                >
                  <td className="p-4">
                    <p className="text-sm text-charcoal font-medium">
                      {cat.name}
                    </p>
                    {cat.parent && (
                      <p className="text-[10px] text-text-muted">
                        Subcategory
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-xs text-text-muted font-mono hidden md:table-cell">
                    {cat.slug}
                  </td>
                  <td className="p-4 text-xs text-text-secondary capitalize hidden md:table-cell">
                    {cat.type}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                        cat.isActive
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-border text-text-muted"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 text-text-muted hover:text-gold"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 text-text-muted hover:text-error"
                      >
                        <Trash2 size={14} />
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
