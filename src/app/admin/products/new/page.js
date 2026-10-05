"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import toast from "@/lib/toast";

const EMPTY_VARIANT = {
  size: "",
  color: "",
  fabric: "",
  sku: "",
  price: "",
  compareAtPrice: "",
  stock: 0,
  image: "",
};

const INITIAL_FORM = {
  name: "",
  sku: "",
  description: "",
  shortDescription: "",
  category: "",
  subcategory: "",
  collections: [],
  fabric: "",

  images: [],
  hoverImage: "",
  video: "",

  price: "",
  compareAtPrice: "",
  costPrice: "",

  variants: [],

  totalStock: 0,
  lowStockThreshold: 5,

  colors: [],
  sizes: [],
  tags: [],

  featured: false,
  bestseller: false,
  newArrival: true,

  status: "draft",

  seo: {
    title: "",
    description: "",
    keywords: [],
  },
};

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState(INITIAL_FORM);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [fabrics, setFabrics] = useState([]);
  const [loadingFabrics, setLoadingFabrics] = useState(true);
  const [fabricError, setFabricError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef(null);

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type?.startsWith("image/")) {
        toast.error(`${file.name}: Only image files are allowed`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: Image must be 10MB or less`);
        return false;
      }

      return true;
    });

    if (!validFiles.length) {
      event.target.value = "";
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.image?.url) {
          throw new Error(
            data.message || `Failed to upload ${file.name}`
          );
        }

        uploadedUrls.push(data.image.url);

        setUploadProgress(
          Math.round(((i + 1) / validFiles.length) * 100)
        );
      }

      setForm((prev) => ({
        ...prev,
        images: [
          ...prev.images.filter((url) => url?.trim()),
          ...uploadedUrls,
        ],
      }));

      toast.success(
        `${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded successfully`
      );
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);

      if (event.target) {
        event.target.value = "";
      }
    }
  }

  function openImagePicker() {
    if (!uploadingImages) {
      imageInputRef.current?.click();
    }
  }

  function handleImageDrop(event) {
    event.preventDefault();

    if (uploadingImages) return;

    const files = Array.from(event.dataTransfer.files || []);

    if (!files.length) return;

    handleImageUpload({
      target: {
        files,
        value: "",
      },
    });
  }

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        setLoadingCategories(true);

        const response = await axios.get("/api/categories");

        const data =
          response?.data?.data?.categories ||
          response?.data?.categories ||
          [];

        if (active) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Category loading error:", error);

        if (active) {
          toast.error("Could not load categories");
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    }

    async function fetchFabrics() {
      try {
        setLoadingFabrics(true);
        setFabricError("");

        const response = await axios.get("/api/admin/fabrics", {
          cache: "no-store",
        });

        const data =
          response?.data?.data?.fabrics ||
          response?.data?.fabrics ||
          [];

        if (active) {
          setFabrics(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Fabric loading error:", error);

        if (active) {
          setFabrics([]);
          setFabricError(
            error?.response?.data?.message ||
              "Could not load fabrics"
          );
        }
      } finally {
        if (active) {
          setLoadingFabrics(false);
        }
      }
    }

    fetchCategories();
    fetchFabrics();

    return () => {
      active = false;
    };
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((item) => String(item._id) === String(form.category)),
    [categories, form.category]
  );

  const subcategories = useMemo(() => {
    if (!form.category) return [];

    return categories.filter(
      (item) =>
        String(item.parent || item.parentCategory || item.parentId || "") ===
        String(form.category)
    );
  }, [categories, form.category]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateSeo(field, value) {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  }

  function addArrayItem(field, value, clear) {
    const clean = value.trim();

    if (!clean) return;

    setForm((prev) => {
      if (prev[field].includes(clean)) return prev;

      return {
        ...prev,
        [field]: [...prev[field], clean],
      };
    });

    clear("");
  }

  function removeArrayItem(field, index) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function updateImage(index, value) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item, i) =>
        i === index ? value : item
      ),
    }));
  }

  function addImage() {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  }

  function removeImage(index) {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: images.length ? images : [""],
      };
    });
  }

  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...EMPTY_VARIANT }],
    }));
  }

  function updateVariant(index, field, value) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      ),
    }));
  }

  function removeVariant(index) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }

  function calculateTotalStock() {
    if (!form.variants.length) {
      return Number(form.totalStock) || 0;
    }

    return form.variants.reduce(
      (sum, variant) => sum + (Number(variant.stock) || 0),
      0
    );
  }

  function slugPreview() {
    return form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function validate() {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return false;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Enter a valid product price");
      return false;
    }

    const validImages = form.images.filter((url) => url.trim());

    if (!validImages.length) {
      toast.error("Add at least one product image");
      return false;
    }

    if (
      form.compareAtPrice &&
      Number(form.compareAtPrice) < Number(form.price)
    ) {
      toast.error("Compare-at price should be higher than selling price");
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      const images = form.images
        .filter((url) => typeof url === "string")
        .map((url) => url.trim())
        .filter(Boolean);

      const variants = form.variants.map((variant) => ({
        size: variant.size.trim(),
        color: variant.color.trim(),
        fabric: variant.fabric.trim(),
        sku: variant.sku.trim(),
        price: variant.price ? Number(variant.price) : undefined,
        compareAtPrice: variant.compareAtPrice
          ? Number(variant.compareAtPrice)
          : undefined,
        stock: Number(variant.stock) || 0,
        image: variant.image.trim(),
      }));

      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,

        description: form.description.trim(),
        shortDescription: form.shortDescription.trim(),

        category: form.category,
        ...(form.subcategory
          ? { subcategory: form.subcategory }
          : {}),

        collections: form.collections,

        ...(form.fabric
          ? { fabric: form.fabric }
          : {}),

        images,
        hoverImage: form.hoverImage.trim(),
        video: form.video.trim(),

        price: Number(form.price),
        ...(form.compareAtPrice
          ? { compareAtPrice: Number(form.compareAtPrice) }
          : {}),
        ...(form.costPrice
          ? { costPrice: Number(form.costPrice) }
          : {}),

        variants,

        totalStock: calculateTotalStock(),
        lowStockThreshold: Number(form.lowStockThreshold) || 5,

        colors: form.colors,
        sizes: form.sizes,
        tags: form.tags,

        featured: form.featured,
        bestseller: form.bestseller,
        newArrival: form.newArrival,

        status: form.status,

        seo: {
          title: form.seo.title.trim(),
          description: form.seo.description.trim(),
          keywords: form.seo.keywords,
        },
      };

      await axios.post("/api/admin/products", payload);

      toast.success("Product created successfully");

      setTimeout(() => {
        router.push("/admin/products");
      }, 500);
    } catch (error) {
      console.error("Create product error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create product";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-gold transition-colors mb-5"
        >
          <ArrowLeft size={14} />
          Back to Products
        </button>

        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} className="text-gold" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                Product Studio
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
              Add New Product
            </h1>

            <p className="text-sm text-text-muted mt-2">
              Create and publish a premium Thobeian product.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-white border border-border text-[10px] uppercase tracking-widest text-text-muted">
              {form.status}
            </div>

            <button
              type="submit"
              form="product-form"
              disabled={saving}
              className="btn-primary flex items-center justify-center gap-2 px-5 py-3 text-xs disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            {/* Basic information */}
            <Section
              number="01"
              title="Product Information"
              description="Core information customers will see."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Product Name" required className="md:col-span-2">
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Royal Signature Thobe"
                    className="input"
                  />
                </Field>

                <Field label="SKU">
                  <input
                    value={form.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    placeholder="THB-ROYAL-001"
                    className="input font-mono"
                  />
                </Field>

                <Field label="URL Slug">
                  <div className="input bg-background-luxury text-text-muted">
                    {slugPreview() || "product-slug"}
                  </div>
                </Field>

                <Field
                  label="Short Description"
                  className="md:col-span-2"
                >
                  <textarea
                    value={form.shortDescription}
                    onChange={(e) =>
                      updateField("shortDescription", e.target.value)
                    }
                    rows={3}
                    placeholder="A concise premium product summary..."
                    className="input resize-none"
                  />
                </Field>

                <Field
                  label="Full Description"
                  className="md:col-span-2"
                >
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    rows={7}
                    placeholder="Describe fabric, craftsmanship, fit, details and styling..."
                    className="input resize-y"
                  />
                </Field>
              </div>
            </Section>

            {/* Organization */}
            <Section
              number="02"
              title="Organization"
              description="Place the product in your store structure."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      updateField("category", e.target.value);
                      updateField("subcategory", "");
                    }}
                    className="input"
                    disabled={loadingCategories}
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories
                      .filter(
                        (category) =>
                          !category.parent &&
                          !category.parentCategory
                      )
                      .map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field label="Subcategory">
                  <select
                    value={form.subcategory}
                    onChange={(e) =>
                      updateField("subcategory", e.target.value)
                    }
                    className="input"
                    disabled={!form.category}
                  >
                    <option value="">
                      {form.category
                        ? "Select subcategory"
                        : "Choose category first"}
                    </option>

                    {subcategories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {selectedCategory && (
                  <div className="md:col-span-2 p-4 border border-gold/20 bg-gold/5 flex items-start gap-3">
                    <div className="w-9 h-9 bg-gold/10 flex items-center justify-center shrink-0">
                      <Check size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {selectedCategory.name}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Category selected successfully.
                      </p>
                    </div>
                  </div>
                )}

                <Field label="Fabric">
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={form.fabric}
                        onChange={(e) =>
                          updateField("fabric", e.target.value)
                        }
                        disabled={loadingFabrics}
                        className="input appearance-none pr-12 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">
                          {loadingFabrics
                            ? "Loading fabrics..."
                            : fabricError
                              ? "Unable to load fabrics"
                              : "Select a fabric"}
                        </option>

                        {fabrics.map((fabric) => (
                          <option
                            key={fabric._id}
                            value={fabric._id}
                          >
                            {fabric.name}
                            {Number(fabric.priceModifier) > 0
                              ? ` (+৳${Number(
                                  fabric.priceModifier
                                ).toLocaleString("en-BD")})`
                              : ""}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                      />
                    </div>

                    {fabricError ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-xs leading-5 text-red-700">
                          {fabricError}
                        </p>

                        <button
                          type="button"
                          onClick={() => window.location.reload()}
                          className="shrink-0 text-xs font-semibold text-red-700 hover:underline"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs leading-5 text-text-muted">
                        Choose the actual fabric used for this product.
                        The corresponding MongoDB Fabric ID will be saved
                        automatically.
                      </p>
                    )}
                  </div>
                </Field>
              </div>
            </Section>

            {/* Images */}
            <Section
              number="03"
              title="Media"
              description="Add product imagery and optional video."
            >
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      Product Images <span className="text-gold">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={addImage}
                      className="text-xs text-gold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={13} />
                      Add image
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div
                      onClick={openImagePicker}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleImageDrop}
                      className={`group relative mb-5 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                        uploadingImages
                          ? "border-gold bg-gold/5"
                          : "border-[#D8C3A5]/60 bg-[#FAF9F6] hover:border-gold hover:bg-[#F7F3EA]"
                      }`}
                    >
                      <div className="flex min-h-[210px] flex-col items-center justify-center px-6 py-8 text-center">
                        {uploadingImages ? (
                          <>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                              <Loader2
                                size={26}
                                className="animate-spin text-gold"
                              />
                            </div>

                            <p className="text-sm font-semibold text-charcoal">
                              Uploading images...
                            </p>

                            <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-[#EFE8DC]">
                              <div
                                className="h-full rounded-full bg-gold transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>

                            <p className="mt-2 text-xs text-text-muted">
                              {uploadProgress}% complete
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                              <UploadCloud
                                size={27}
                                className="text-gold"
                              />
                            </div>

                            <p className="text-sm font-semibold text-charcoal">
                              Upload Product Images
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                              Click to browse or drag & drop your images here
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D8C3A5]/50 bg-white px-4 py-2 text-xs font-medium text-charcoal shadow-sm">
                              <Plus size={14} />
                              Choose Images
                            </div>

                            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                              JPG · PNG · WEBP · Max 10MB each
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {form.images
                      .filter((image) => image?.trim())
                      .map((image, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <div className="w-14 h-14 bg-background-luxury border border-border shrink-0 flex items-center justify-center overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon
                              size={18}
                              className="text-text-muted"
                            />
                          )}
                        </div>

                        <input
                          value={image}
                          onChange={(e) =>
                            updateImage(index, e.target.value)
                          }
                          placeholder="https://example.com/product-image.jpg"
                          className="input flex-1"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-11 border border-border text-text-muted hover:text-error hover:border-error/30 transition-colors flex items-center justify-center"
                          title="Remove image"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-text-muted mt-2">
                    Use publicly accessible image URLs. The first image will
                    be the primary product image.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Hover Image URL">
                    <input
                      value={form.hoverImage}
                      onChange={(e) =>
                        updateField("hoverImage", e.target.value)
                      }
                      placeholder="Optional second image"
                      className="input"
                    />
                  </Field>

                  <Field label="Product Video URL">
                    <input
                      value={form.video}
                      onChange={(e) =>
                        updateField("video", e.target.value)
                      }
                      placeholder="Optional video URL"
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* Pricing */}
            <Section
              number="04"
              title="Pricing"
              description="Set customer-facing and internal pricing."
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Field label="Selling Price (BDT)" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        updateField("price", e.target.value)
                      }
                      placeholder="5490"
                      className="input pl-8"
                    />
                  </div>
                </Field>

                <Field label="Compare-at Price">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.compareAtPrice}
                      onChange={(e) =>
                        updateField("compareAtPrice", e.target.value)
                      }
                      placeholder="6490"
                      className="input pl-8"
                    />
                  </div>
                </Field>

                <Field label="Cost Price">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.costPrice}
                      onChange={(e) =>
                        updateField("costPrice", e.target.value)
                      }
                      placeholder="Internal only"
                      className="input pl-8"
                    />
                  </div>
                </Field>
              </div>
            </Section>

            {/* Inventory */}
            <Section
              number="05"
              title="Inventory"
              description="Manage stock, sizes and product colors."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Total Stock">
                  <input
                    type="number"
                    min="0"
                    value={form.totalStock}
                    onChange={(e) =>
                      updateField("totalStock", e.target.value)
                    }
                    disabled={form.variants.length > 0}
                    className="input disabled:bg-background-luxury disabled:text-text-muted"
                  />
                  {form.variants.length > 0 && (
                    <p className="text-[10px] text-text-muted mt-2">
                      Automatically calculated from variants.
                    </p>
                  )}
                </Field>

                <Field label="Low Stock Threshold">
                  <input
                    type="number"
                    min="0"
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      updateField(
                        "lowStockThreshold",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </Field>

                <ArrayEditor
                  label="Sizes"
                  items={form.sizes}
                  value={sizeInput}
                  setValue={setSizeInput}
                  add={() =>
                    addArrayItem(
                      "sizes",
                      sizeInput,
                      setSizeInput
                    )
                  }
                  remove={(index) =>
                    removeArrayItem("sizes", index)
                  }
                  placeholder="S, M, L, XL..."
                />

                <ArrayEditor
                  label="Colors"
                  items={form.colors}
                  value={colorInput}
                  setValue={setColorInput}
                  add={() =>
                    addArrayItem(
                      "colors",
                      colorInput,
                      setColorInput
                    )
                  }
                  remove={(index) =>
                    removeArrayItem("colors", index)
                  }
                  placeholder="White, Black, Sand..."
                />

                <ArrayEditor
                  label="Tags"
                  items={form.tags}
                  value={tagInput}
                  setValue={setTagInput}
                  add={() =>
                    addArrayItem(
                      "tags",
                      tagInput,
                      setTagInput
                    )
                  }
                  remove={(index) =>
                    removeArrayItem("tags", index)
                  }
                  placeholder="premium, thobe, luxury..."
                  className="md:col-span-2"
                />
              </div>
            </Section>

            {/* Variants */}
            <Section
              number="06"
              title="Variants"
              description="Create individual SKU, size, color and stock combinations."
              action={
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-xs text-gold flex items-center gap-1"
                >
                  <Plus size={13} />
                  Add Variant
                </button>
              }
            >
              {form.variants.length === 0 ? (
                <div className="border border-dashed border-border p-8 text-center">
                  <PackageIcon />
                  <p className="text-sm text-charcoal mt-3">
                    No variants added
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Use variants when each size/color combination needs
                    separate stock or pricing.
                  </p>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-gold text-gold text-xs hover:bg-gold hover:text-white transition-colors"
                  >
                    <Plus size={13} />
                    Create First Variant
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="border border-border p-4 md:p-5 bg-background-luxury/40"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gold">
                            Variant {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">
                            {variant.size || "Size"} /{" "}
                            {variant.color || "Color"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-2 text-text-muted hover:text-error"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MiniField label="Size">
                          <input
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "size",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="XL"
                          />
                        </MiniField>

                        <MiniField label="Color">
                          <input
                            value={variant.color}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "color",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="Stone Grey"
                          />
                        </MiniField>

                        <MiniField label="Fabric">
                          <input
                            value={variant.fabric}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "fabric",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="Premium Cotton"
                          />
                        </MiniField>

                        <MiniField label="SKU">
                          <input
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "sku",
                                e.target.value
                              )
                            }
                            className="input font-mono"
                            placeholder="THB-XL-GRY"
                          />
                        </MiniField>

                        <MiniField label="Price">
                          <input
                            type="number"
                            min="0"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="5490"
                          />
                        </MiniField>

                        <MiniField label="Compare Price">
                          <input
                            type="number"
                            min="0"
                            value={variant.compareAtPrice}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "compareAtPrice",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="6490"
                          />
                        </MiniField>

                        <MiniField label="Stock">
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            className="input"
                          />
                        </MiniField>

                        <MiniField label="Variant Image">
                          <input
                            value={variant.image}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "image",
                                e.target.value
                              )
                            }
                            className="input"
                            placeholder="Image URL"
                          />
                        </MiniField>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Marketing */}
            <Section
              number="07"
              title="Merchandising"
              description="Control product visibility and merchandising labels."
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Toggle
                  label="Featured"
                  description="Show in featured areas"
                  checked={form.featured}
                  onChange={(value) =>
                    updateField("featured", value)
                  }
                />

                <Toggle
                  label="Bestseller"
                  description="Mark as bestseller"
                  checked={form.bestseller}
                  onChange={(value) =>
                    updateField("bestseller", value)
                  }
                />

                <Toggle
                  label="New Arrival"
                  description="Mark as new arrival"
                  checked={form.newArrival}
                  onChange={(value) =>
                    updateField("newArrival", value)
                  }
                />
              </div>
            </Section>

            {/* SEO */}
            <Section
              number="08"
              title="SEO"
              description="Optimize how this product appears in search engines."
              action={
                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="text-xs text-text-muted hover:text-gold flex items-center gap-1"
                >
                  {showAdvanced ? "Hide" : "Show"} advanced
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                  />
                </button>
              }
            >
              <div className="space-y-5">
                <Field label="SEO Title">
                  <input
                    value={form.seo.title}
                    onChange={(e) =>
                      updateSeo("title", e.target.value)
                    }
                    placeholder="Royal Signature Thobe | Thobeian"
                    className="input"
                  />
                  <CharacterCount
                    value={form.seo.title}
                    recommended={60}
                  />
                </Field>

                <Field label="SEO Description">
                  <textarea
                    value={form.seo.description}
                    onChange={(e) =>
                      updateSeo("description", e.target.value)
                    }
                    rows={4}
                    placeholder="Premium thobe crafted for timeless Islamic elegance..."
                    className="input resize-none"
                  />
                  <CharacterCount
                    value={form.seo.description}
                    recommended={160}
                  />
                </Field>

                {showAdvanced && (
                  <ArrayEditor
                    label="SEO Keywords"
                    items={form.seo.keywords}
                    value={keywordInput}
                    setValue={setKeywordInput}
                    add={() =>
                      setForm((prev) => {
                        const clean = keywordInput.trim();

                        if (
                          !clean ||
                          prev.seo.keywords.includes(clean)
                        ) {
                          return prev;
                        }

                        return {
                          ...prev,
                          seo: {
                            ...prev.seo,
                            keywords: [
                              ...prev.seo.keywords,
                              clean,
                            ],
                          },
                        };
                      }) || setKeywordInput("")
                    }
                    remove={(index) =>
                      setForm((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          keywords: prev.seo.keywords.filter(
                            (_, i) => i !== index
                          ),
                        },
                      }))
                    }
                    placeholder="premium thobe"
                  />
                )}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-border p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
                Publishing
              </p>

              <label className="label">
                Product Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className="input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <div className="mt-4 p-3 bg-background-luxury border border-border">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      form.status === "published"
                        ? "bg-success"
                        : form.status === "draft"
                        ? "bg-warning"
                        : "bg-text-muted"
                    }`}
                  />
                  <span className="text-xs text-charcoal">
                    {form.status === "published"
                      ? "Visible to customers"
                      : form.status === "draft"
                      ? "Saved but hidden"
                      : "Archived"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                    Live Preview
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Store product card
                  </p>
                </div>

                <Upload size={15} className="text-text-muted" />
              </div>

              <div className="aspect-[4/5] bg-background-luxury relative overflow-hidden">
                {form.images[0] ? (
                  <img
                    src={form.images[0]}
                    alt={form.name || "Product preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                    <ImageIcon size={34} strokeWidth={1} />
                    <p className="text-xs mt-3">
                      Add a product image
                    </p>
                  </div>
                )}

                {form.featured && (
                  <span className="absolute top-3 left-3 bg-charcoal text-white text-[9px] uppercase tracking-widest px-2.5 py-1.5">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-charcoal min-h-[20px]">
                  {form.name || "Product Name"}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-charcoal font-medium">
                    {form.price
                      ? `৳${Number(form.price).toLocaleString()}`
                      : "৳0"}
                  </p>

                  {form.compareAtPrice && (
                    <p className="text-[10px] text-text-muted line-through">
                      ৳
                      {Number(
                        form.compareAtPrice
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                {form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {form.colors.slice(0, 5).map((color) => (
                      <span
                        key={color}
                        className="text-[9px] border border-border px-2 py-1 text-text-muted"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stock summary */}
            <div className="bg-charcoal text-white p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                Inventory Summary
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <SummaryMetric
                  label="Stock"
                  value={calculateTotalStock()}
                />

                <SummaryMetric
                  label="Variants"
                  value={form.variants.length}
                />

                <SummaryMetric
                  label="Sizes"
                  value={form.sizes.length}
                />

                <SummaryMetric
                  label="Colors"
                  value={form.colors.length}
                />
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-border p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">
                Quick Actions
              </p>

              <button
                type="button"
                onClick={() => {
                  setForm(INITIAL_FORM);
                  toast.success("Form cleared");
                }}
                className="w-full flex items-center justify-center gap-2 border border-border py-2.5 text-xs text-text-muted hover:text-error hover:border-error/30 transition-colors"
              >
                <X size={14} />
                Clear Form
              </button>
            </div>
          </aside>
        </div>

        {/* Bottom action */}
        <div className="mt-8 bg-white border border-border p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-charcoal font-medium">
              Ready to create this product?
            </p>
            <p className="text-xs text-text-muted mt-1">
              Review the information before publishing.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="flex-1 sm:flex-none px-5 py-3 border border-border text-xs text-text-muted hover:text-charcoal transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none btn-primary px-6 py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--border, #e5e1d8);
          background: #ffffff;
          padding: 0.7rem 0.8rem;
          font-size: 0.75rem;
          color: #1f1f1f;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .input:focus {
          border-color: #c8a96b;
          box-shadow: 0 0 0 3px rgba(200, 169, 107, 0.08);
        }

        .input::placeholder {
          color: #a6a19a;
        }

        .label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6f6a63;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function Section({
  number,
  title,
  description,
  children,
  action,
}) {
  return (
    <section className="bg-white border border-border">
      <div className="px-5 md:px-6 py-5 border-b border-border flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="text-[10px] text-gold font-mono pt-0.5">
            {number}
          </span>

          <div>
            <h2 className="text-sm md:text-base text-charcoal font-medium">
              {title}
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function MiniField({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function ArrayEditor({
  label,
  items,
  value,
  setValue,
  add,
  remove,
  placeholder,
  className = "",
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add();
    }
  }

  return (
    <div className={className}>
      <label className="label">{label}</label>

      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input flex-1"
        />

        <button
          type="button"
          onClick={add}
          className="w-11 shrink-0 border border-border hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1.5 bg-background-luxury border border-border px-2.5 py-1.5 text-[10px] text-charcoal"
            >
              {item}

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-text-muted hover:text-error"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`text-left p-4 border transition-all ${
        checked
          ? "border-gold bg-gold/5"
          : "border-border bg-white hover:border-gold/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-charcoal">
          {label}
        </span>

        <span
          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
            checked ? "bg-gold" : "bg-border"
          }`}
        >
          <span
            className={`block w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
      </div>

      <p className="text-[10px] text-text-muted mt-2">
        {description}
      </p>
    </button>
  );
}

function CharacterCount({ value, recommended }) {
  const count = value.length;

  return (
    <p
      className={`text-[10px] mt-1 ${
        count > recommended
          ? "text-warning"
          : "text-text-muted"
      }`}
    >
      {count}/{recommended} characters
    </p>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div>
      <p className="font-serif text-2xl text-white">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-white/50 mt-1">
        {label}
      </p>
    </div>
  );
}

function PackageIcon() {
  return (
    <div className="w-10 h-10 mx-auto border border-border flex items-center justify-center">
      <ImageIcon size={17} className="text-text-muted" />
    </div>
  );
}
