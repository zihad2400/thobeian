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
    parent: "",
    type: "thobe",
    sortOrder: 0,
    isActive: true,
    showInMenu: true,
    showInMegaMenu: false,
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
  });

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/admin/categories");

        if (active) {
          setCategories(data.data.categories || []);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (active) {
          toast.error("Failed to load categories");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/categories");
      setCategories(data.data.categories || []);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
      toast.error("Failed to refresh categories");
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
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      parent: cat.parent?._id || cat.parent || "",
      type: cat.type || "thobe",
      sortOrder: Number(cat.sortOrder || 0),
      isActive: cat.isActive !== false,
      showInMenu: cat.showInMenu !== false,
      showInMegaMenu: Boolean(cat.showInMegaMenu),
      seo: {
        title: cat.seo?.title || "",
        description: cat.seo?.description || "",
        keywords: Array.isArray(cat.seo?.keywords)
          ? cat.seo.keywords
          : [],
      },
    });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      parent: "",
      type: "thobe",
      sortOrder: 0,
      isActive: true,
      showInMenu: true,
      showInMegaMenu: false,
      seo: {
        title: "",
        description: "",
        keywords: [],
      },
    });
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
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="input-luxury"
              >
                <option value="thobe">Thobe</option>
                <option value="jubba">Jubba</option>
                <option value="panjabi">Panjabi</option>
                <option value="fabric">Fabric</option>
                <option value="collection">Collection</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Parent Category
              </label>
              <select
                value={form.parent}
                onChange={(e) =>
                  setForm({ ...form, parent: e.target.value })
                }
                className="input-luxury"
              >
                <option value="">No Parent — Main Category</option>
                {categories
                  .filter((cat) => cat._id !== editingId)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.parent ? "↳ " : ""}
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                Sort Order
              </label>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sortOrder: Number(e.target.value) || 0,
                  })
                }
                className="input-luxury"
              />
            </div>

            <div className="md:col-span-2 grid sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-3 border border-border cursor-pointer hover:border-gold transition-colors">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-gold"
                />
                <span>
                  <span className="block text-sm text-charcoal">
                    Active
                  </span>
                  <span className="block text-[10px] text-text-muted mt-0.5">
                    Category is available
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-border cursor-pointer hover:border-gold transition-colors">
                <input
                  type="checkbox"
                  checked={form.showInMenu}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      showInMenu: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-gold"
                />
                <span>
                  <span className="block text-sm text-charcoal">
                    Show in Menu
                  </span>
                  <span className="block text-[10px] text-text-muted mt-0.5">
                    Main navigation visibility
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-border cursor-pointer hover:border-gold transition-colors">
                <input
                  type="checkbox"
                  checked={form.showInMegaMenu}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      showInMegaMenu: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-gold"
                />
                <span>
                  <span className="block text-sm text-charcoal">
                    Mega Menu
                  </span>
                  <span className="block text-[10px] text-text-muted mt-0.5">
                    Include in mega menu
                  </span>
                </span>
              </label>
            </div>
            <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="input-luxury resize-none"
              placeholder="Describe this category..."
            />
          </div>

          <div className="md:col-span-2 mt-2 pt-5 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">
                  Search Engine Optimization
                </p>
                <h4 className="font-serif text-base text-charcoal mt-1">
                  SEO Settings
                </h4>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                  SEO Title
                </label>
                <input
                  type="text"
                  maxLength={70}
                  value={form.seo.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: {
                        ...form.seo,
                        title: e.target.value,
                      },
                    })
                  }
                  className="input-luxury"
                  placeholder="Category SEO title"
                />
                <p className="text-[10px] text-text-muted mt-1 text-right">
                  {form.seo.title.length}/70
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={form.seo.keywords.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: {
                        ...form.seo,
                        keywords: e.target.value
                          .split(",")
                          .map((keyword) => keyword.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="input-luxury"
                  placeholder="thobe, premium thobe, islamic clothing"
                />
                <p className="text-[10px] text-text-muted mt-1">
                  Separate keywords with commas
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 block">
                  SEO Description
                </label>
                <textarea
                  maxLength={160}
                  value={form.seo.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: {
                        ...form.seo,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="input-luxury resize-none"
                  placeholder="Search engine description for this category..."
                />
                <p className="text-[10px] text-text-muted mt-1 text-right">
                  {form.seo.description.length}/160
                </p>
              </div>
            </div>
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
        <div className="bg-white border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-background-luxury border-b border-border">
                <tr>
                  <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                    Category
                  </th>
                  <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                    Type
                  </th>
                  <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                    Order
                  </th>
                  <th className="text-left p-4 text-[10px] uppercase tracking-widest text-text-muted font-medium">
                    Visibility
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
                {filtered.map((cat) => {
                  const parentName =
                    typeof cat.parent === "object"
                      ? cat.parent?.name
                      : categories.find(
                          (parent) => parent._id === cat.parent
                        )?.name;

                  const isSubcategory = Boolean(cat.parent);

                  return (
                    <tr
                      key={cat._id}
                      className={`border-b border-border last:border-b-0 transition-colors hover:bg-background-luxury ${
                        isSubcategory ? "bg-background-luxury/30" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                              isSubcategory
                                ? "border-border bg-white"
                                : "border-gold/30 bg-gold/5"
                            }`}
                          >
                            <FolderTree
                              size={15}
                              className={
                                isSubcategory
                                  ? "text-text-muted"
                                  : "text-gold"
                              }
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {isSubcategory && (
                                <span className="text-gold text-xs">
                                  ↳
                                </span>
                              )}

                              <p className="text-sm text-charcoal font-medium truncate">
                                {cat.name}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-text-muted font-mono">
                                /{cat.slug}
                              </span>

                              {isSubcategory && parentName && (
                                <span className="text-[9px] uppercase tracking-wider text-text-muted">
                                  • {parentName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 border border-border bg-white text-[10px] uppercase tracking-wider text-text-secondary">
                          {cat.type || "other"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-xs text-text-secondary tabular-nums">
                          {Number(cat.sortOrder || 0)}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.showInMenu !== false && (
                            <span className="text-[9px] uppercase tracking-wider px-2 py-1 border border-gold/20 bg-gold/5 text-gold">
                              Menu
                            </span>
                          )}

                          {cat.showInMegaMenu && (
                            <span className="text-[9px] uppercase tracking-wider px-2 py-1 border border-border bg-background-luxury text-text-muted">
                              Mega
                            </span>
                          )}

                          {cat.showInMenu === false &&
                            !cat.showInMegaMenu && (
                              <span className="text-[9px] uppercase tracking-wider px-2 py-1 border border-border text-text-muted">
                                Hidden
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest px-2.5 py-1.5 border ${
                            cat.isActive
                              ? "bg-success/10 text-success border-success/30"
                              : "bg-border/50 text-text-muted border-border"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              cat.isActive
                                ? "bg-success"
                                : "bg-text-muted"
                            }`}
                          />
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-text-muted hover:text-gold hover:bg-gold/5 transition-colors"
                            title="Edit category"
                            aria-label={`Edit ${cat.name}`}
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete category"
                            aria-label={`Delete ${cat.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
