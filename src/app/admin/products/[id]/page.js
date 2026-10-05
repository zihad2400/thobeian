"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Loader2,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import toast from "@/lib/toast";

const EMPTY_FORM = {
  name: "",
  sku: "",
  description: "",
  shortDescription: "",
  category: "",
  subcategory: "",
  fabric: "",
  images: [],
  hoverImage: "",
  video: "",
  price: "",
  compareAtPrice: "",
  costPrice: "",
  totalStock: 0,
  lowStockThreshold: 5,
  colors: [],
  sizes: [],
  tags: [],
  variants: [],
  collections: [],
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState("");
  const [optionsError, setOptionsError] = useState("");

  useEffect(() => {
    if (!productId) return;

    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `/api/admin/products/${productId}`
        );

        const product =
          response?.data?.data?.product ||
          response?.data?.product;

        if (!product) {
          throw new Error("Product not found");
        }

        if (active) {
          setForm({
            name: product.name || "",
            sku: product.sku || "",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            category: product.category
              ? String(product.category)
              : "",
            subcategory: product.subcategory
              ? String(product.subcategory)
              : "",
            fabric: product.fabric
              ? String(product.fabric)
              : "",
            price:
              product.price !== undefined &&
              product.price !== null
                ? String(product.price)
                : "",
            compareAtPrice:
              product.compareAtPrice !== undefined &&
              product.compareAtPrice !== null
                ? String(product.compareAtPrice)
                : "",
            costPrice:
              product.costPrice !== undefined &&
              product.costPrice !== null
                ? String(product.costPrice)
                : "",
            totalStock: Number(product.totalStock || 0),
            lowStockThreshold: Number(
              product.lowStockThreshold ?? 5
            ),
            featured: Boolean(product.featured),
            bestseller: Boolean(product.bestseller),
            newArrival:
              product.newArrival === undefined
                ? true
                : Boolean(product.newArrival),
            status: product.status || "draft",
            images: Array.isArray(product.images)
              ? product.images
              : [],
            hoverImage: product.hoverImage || "",
            video: product.video || "",
            colors: Array.isArray(product.colors)
              ? product.colors
              : [],
            sizes: Array.isArray(product.sizes)
              ? product.sizes
              : [],
            tags: Array.isArray(product.tags)
              ? product.tags
              : [],
            variants: Array.isArray(product.variants)
              ? product.variants.map((variant) => ({
                  size: variant?.size || "",
                  color: variant?.color || "",
                  fabric: variant?.fabric || "",
                  sku: variant?.sku || "",
                  price:
                    variant?.price !== undefined &&
                    variant?.price !== null
                      ? String(variant.price)
                      : "",
                  compareAtPrice:
                    variant?.compareAtPrice !== undefined &&
                    variant?.compareAtPrice !== null
                      ? String(variant.compareAtPrice)
                      : "",
                  stock: Number(variant?.stock || 0),
                  image: variant?.image || "",
                }))
              : [],
            collections: Array.isArray(product.collections)
              ? product.collections.map((collection) =>
                  String(collection?._id || collection)
                )
              : [],
            seo: {
              title: product.seo?.title || "",
              description: product.seo?.description || "",
              keywords: Array.isArray(product.seo?.keywords)
                ? product.seo.keywords
                : [],
            },
          });
        }
      } catch (err) {
        console.error("Product loading error:", err);

        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load product"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    let active = true;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setOptionsError("");

        const [
          categoryResponse,
          fabricResponse,
          collectionResponse,
        ] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/admin/fabrics"),
          axios.get("/api/collections"),
        ]);

        const categoryData =
          categoryResponse?.data?.data?.categories ||
          categoryResponse?.data?.categories ||
          [];

        const fabricData =
          fabricResponse?.data?.data?.fabrics ||
          fabricResponse?.data?.fabrics ||
          [];

        const collectionData =
          collectionResponse?.data?.data?.collections ||
          collectionResponse?.data?.collections ||
          [];

        if (active) {
          setCategories(
            Array.isArray(categoryData)
              ? categoryData
              : []
          );

          setFabrics(
            Array.isArray(fabricData)
              ? fabricData
              : []
          );

          setCollections(
            Array.isArray(collectionData)
              ? collectionData
              : []
          );
        }
      } catch (err) {
        console.error("Edit options loading error:", err);

        if (active) {
          setOptionsError(
            err?.response?.data?.message ||
              "Could not load categories, fabrics, or collections"
          );
        }
      } finally {
        if (active) {
          setLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const subcategories = useMemo(() => {
    if (!form.category) return [];

    return categories.filter(
      (item) =>
        String(
          item.parent ||
            item.parentCategory ||
            item.parentId ||
            ""
        ) === String(form.category)
    );
  }, [categories, form.category]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length || uploadingImages) return;

    try {
      setUploadingImages(true);
      setUploadProgress(0);

      const uploadedUrls = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];

        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not a valid image`);
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the 10MB limit`);
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || `Failed to upload ${file.name}`
          );
        }

        if (data?.image?.url) {
          uploadedUrls.push(data.image.url);
        }

        setUploadProgress(
          Math.round(((index + 1) / files.length) * 100)
        );
      }

      if (uploadedUrls.length) {
        setForm((current) => ({
          ...current,
          images: [
            ...current.images.filter((url) => url?.trim()),
            ...uploadedUrls,
          ],
        }));

        toast.success(
          `${uploadedUrls.length} image${
            uploadedUrls.length > 1 ? "s" : ""
          } uploaded successfully`
        );
      }
    } catch (uploadError) {
      console.error("Edit image upload error:", uploadError);
      toast.error(
        uploadError?.message || "Image upload failed"
      );
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((current) => {
      const images = current.images.filter((_, i) => i !== index);

      return {
        ...current,
        images,
        hoverImage:
          current.hoverImage === current.images[index]
            ? ""
            : current.hoverImage,
      };
    });
  };

  const moveImage = (index, direction) => {
    setForm((current) => {
      const nextIndex = index + direction;

      if (
        nextIndex < 0 ||
        nextIndex >= current.images.length
      ) {
        return current;
      }

      const images = [...current.images];
      [images[index], images[nextIndex]] = [
        images[nextIndex],
        images[index],
      ];

      return {
        ...current,
        images,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description.trim(),
        shortDescription: form.shortDescription.trim(),

        category: form.category,

        subcategory:
          form.subcategory && String(form.subcategory).trim()
            ? String(form.subcategory).trim()
            : null,

        fabric:
          form.fabric && String(form.fabric).trim()
            ? String(form.fabric).trim()
            : null,

        price: Number(form.price),

        compareAtPrice:
          form.compareAtPrice !== "" &&
          form.compareAtPrice !== null &&
          form.compareAtPrice !== undefined
            ? Number(form.compareAtPrice)
            : null,

        costPrice:
          form.costPrice !== "" &&
          form.costPrice !== null &&
          form.costPrice !== undefined
            ? Number(form.costPrice)
            : null,

        totalStock: Number(form.totalStock || 0),

        lowStockThreshold: Number(
          form.lowStockThreshold ?? 5
        ),

        images: Array.isArray(form.images)
          ? form.images.filter(
              (url) => typeof url === "string" && url.trim()
            )
          : [],

        hoverImage:
          typeof form.hoverImage === "string"
            ? form.hoverImage.trim()
            : "",

        video:
          typeof form.video === "string"
            ? form.video.trim()
            : "",

        colors: Array.isArray(form.colors)
          ? form.colors.filter(
              (color) =>
                typeof color === "string" && color.trim()
            )
          : [],

        sizes: Array.isArray(form.sizes)
          ? form.sizes.filter(
              (size) =>
                typeof size === "string" && size.trim()
            )
          : [],

        tags: Array.isArray(form.tags)
          ? form.tags.filter(
              (tag) =>
                typeof tag === "string" && tag.trim()
            )
          : [],

        variants: Array.isArray(form.variants)
          ? form.variants.map((variant) => ({
              size: variant?.size?.trim() || "",
              color: variant?.color?.trim() || "",
              fabric: variant?.fabric?.trim() || "",
              sku: variant?.sku?.trim() || "",

              price:
                variant?.price !== "" &&
                variant?.price !== undefined &&
                variant?.price !== null
                  ? Number(variant.price)
                  : undefined,

              compareAtPrice:
                variant?.compareAtPrice !== "" &&
                variant?.compareAtPrice !== undefined &&
                variant?.compareAtPrice !== null
                  ? Number(variant.compareAtPrice)
                  : undefined,

              stock: Number(variant?.stock || 0),

              image:
                typeof variant?.image === "string"
                  ? variant.image.trim()
                  : "",
            }))
          : [],

        collections: Array.isArray(form.collections)
          ? form.collections
          : [],

        featured: Boolean(form.featured),
        bestseller: Boolean(form.bestseller),
        newArrival: Boolean(form.newArrival),

        status: form.status,

        seo: {
          title:
            typeof form.seo?.title === "string"
              ? form.seo.title.trim()
              : "",

          description:
            typeof form.seo?.description === "string"
              ? form.seo.description.trim()
              : "",

          keywords: Array.isArray(form.seo?.keywords)
            ? form.seo.keywords.filter(
                (keyword) =>
                  typeof keyword === "string" &&
                  keyword.trim()
              )
            : [],
        },
      };

      await axios.patch(
        `/api/admin/products/${productId}`,
        payload
      );

      toast.success("Product updated successfully");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("Product update error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={28}
            className="animate-spin text-gold"
          />
          <p className="text-sm text-text-muted">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg border border-border bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-error mb-3">
            Product Error
          </p>

          <h1 className="font-serif text-2xl text-charcoal mb-3">
            Unable to load product
          </h1>

          <p className="text-sm text-text-muted mb-6">
            {error}
          </p>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 border border-charcoal bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold hover:border-gold"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-xs text-text-muted transition hover:text-gold"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>

          <p className="text-xs uppercase tracking-widest text-gold mb-1">
            Manage
          </p>

          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Edit Product
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Update product information, pricing, inventory,
            fabric, and publishing settings.
          </p>
        </div>

        <button
          type="submit"
          form="edit-product-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2
                size={15}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {optionsError && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
          {optionsError}
        </div>
      )}

      <form
        id="edit-product-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        {/* Main */}
        <div className="space-y-6">
          {/* Product Media */}
          <section className="border border-border bg-white p-5 md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">
                  Media
                </p>
                <h2 className="mt-1 font-serif text-xl text-charcoal">
                  Product Images
                </h2>
                <p className="mt-2 text-xs leading-5 text-text-muted">
                  Upload, reorder and manage the images shown on the
                  customer product page.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-border bg-background-luxury px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                {form.images.length}{" "}
                {form.images.length === 1 ? "Image" : "Images"}
              </span>
            </div>

            <div className="space-y-5">
              <label
                htmlFor="edit-product-images"
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition ${
                  uploadingImages
                    ? "cursor-not-allowed border-gold/40 bg-gold/5"
                    : "border-border bg-background-luxury hover:border-gold/50 hover:bg-gold/5"
                }`}
              >
                <input
                  id="edit-product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingImages}
                  onChange={handleImageUpload}
                  className="sr-only"
                />

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-white text-gold shadow-sm transition group-hover:scale-105">
                  {uploadingImages ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Plus size={21} />
                  )}
                </div>

                <p className="text-sm font-semibold text-charcoal">
                  {uploadingImages
                    ? "Uploading images..."
                    : "Add product images"}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  JPG, PNG, WEBP • Maximum 10MB per image
                </p>

                {uploadingImages && (
                  <div className="mt-5 w-full max-w-sm">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      <span>Upload progress</span>
                      <span>{uploadProgress}%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gold transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </label>

              {form.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-background-luxury"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-white">
                        {image ? (
                          <img
                            src={image}
                            alt={`${form.name || "Product"} image ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-text-muted">
                            No image
                          </div>
                        )}
                      </div>

                      {index === 0 && (
                        <div className="absolute left-2 top-2">
                          <span className="rounded-full bg-charcoal/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
                            Primary
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-2 pb-2 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            aria-label="Move image earlier"
                            title="Move earlier"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-charcoal transition hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ←
                          </button>

                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={
                              index === form.images.length - 1
                            }
                            aria-label="Move image later"
                            title="Move later"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-charcoal transition hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            →
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                          title="Remove image"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-error transition hover:bg-error hover:text-white"
                        >
                          ×
                        </button>
                      </div>

                      <div className="pointer-events-none absolute bottom-2 left-2">
                        <span className="rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background-luxury px-6 py-10 text-center">
                  <p className="text-sm font-medium text-charcoal">
                    No product images yet
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Upload at least one high-quality image for the
                    customer product page.
                  </p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Hover Image URL">
                  <input
                    value={form.hoverImage}
                    onChange={(event) =>
                      updateField("hoverImage", event.target.value)
                    }
                    className="input"
                    placeholder="Optional second image URL"
                  />
                </Field>

                <Field label="Product Video URL">
                  <input
                    value={form.video}
                    onChange={(event) =>
                      updateField("video", event.target.value)
                    }
                    className="input"
                    placeholder="Optional video URL"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="border border-border bg-white p-5 md:p-7">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Product
              </p>
              <h2 className="mt-1 font-serif text-xl text-charcoal">
                Basic Information
              </h2>
            </div>

            <div className="space-y-5">
              <Field label="Product Name" required>
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  className="input"
                  placeholder="Premium Thobe"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="SKU">
                  <input
                    value={form.sku}
                    onChange={(event) =>
                      updateField(
                        "sku",
                        event.target.value
                      )
                    }
                    className="input font-mono"
                    placeholder="THB-001"
                  />
                </Field>

                <Field label="Status">
                  <Select
                    value={form.status}
                    onChange={(value) =>
                      updateField("status", value)
                    }
                    options={[
                      {
                        value: "draft",
                        label: "Draft",
                      },
                      {
                        value: "published",
                        label: "Published",
                      },
                      {
                        value: "archived",
                        label: "Archived",
                      },
                    ]}
                  />
                </Field>
              </div>

              <Field label="Short Description">
                <input
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField(
                      "shortDescription",
                      event.target.value
                    )
                  }
                  className="input"
                  placeholder="A short premium description..."
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={7}
                  className="input resize-y"
                  placeholder="Detailed product description..."
                />
              </Field>
            </div>
          </section>

          {/* Organization */}
          <section className="border border-border bg-white p-5 md:p-7">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Organization
              </p>
              <h2 className="mt-1 font-serif text-xl text-charcoal">
                Category & Fabric
              </h2>
            </div>

            <div className="space-y-5">
              <Field label="Category" required>
                <Select
                  value={form.category}
                  onChange={(value) => {
                    updateField("category", value);
                    updateField("subcategory", "");
                  }}
                  loading={loadingOptions}
                  options={categories.map(
                    (category) => ({
                      value: category._id,
                      label: category.name,
                    })
                  )}
                  placeholder="Select category"
                />
              </Field>

              <Field label="Subcategory">
                <Select
                  value={form.subcategory}
                  onChange={(value) =>
                    updateField(
                      "subcategory",
                      value
                    )
                  }
                  loading={loadingOptions}
                  disabled={
                    !form.category ||
                    subcategories.length === 0
                  }
                  options={subcategories.map(
                    (category) => ({
                      value: category._id,
                      label: category.name,
                    })
                  )}
                  placeholder={
                    !form.category
                      ? "Select category first"
                      : subcategories.length === 0
                      ? "No subcategories"
                      : "Select subcategory"
                  }
                />
              </Field>

              <Field label="Fabric">
                <Select
                  value={form.fabric}
                  onChange={(value) =>
                    updateField("fabric", value)
                  }
                  loading={loadingOptions}
                  options={fabrics.map((fabric) => ({
                    value: fabric._id,
                    label:
                      Number(fabric.priceModifier) > 0
                        ? `${fabric.name} (+৳${Number(
                            fabric.priceModifier
                          ).toLocaleString("en-BD")})`
                        : fabric.name,
                  }))}
                  placeholder="Select fabric"
                />
              </Field>
            </div>
          </section>

          {/* Product Attributes */}
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2 className="font-serif text-xl text-charcoal">
                    Product Attributes
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    Manage colors, sizes, and searchable product tags.
                  </p>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-7">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                Colors
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  id="new-product-color"
                  placeholder="e.g. White, Black, Navy"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;

                    event.preventDefault();

                    const value = event.currentTarget.value.trim();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.colors.some(
                        (color) =>
                          color.toLowerCase() === value.toLowerCase()
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        colors: [...prev.colors, value],
                      };
                    });

                    event.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const input =
                      document.getElementById("new-product-color");

                    const value = input?.value?.trim();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.colors.some(
                        (color) =>
                          color.toLowerCase() === value.toLowerCase()
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        colors: [...prev.colors, value],
                      };
                    });

                    if (input) input.value = "";
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold"
                >
                  <Plus size={15} />
                  Add Color
                </button>
              </div>

              {form.colors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.colors.map((color, index) => (
                    <div
                      key={`${color}-${index}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-border bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-charcoal"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-charcoal/10 bg-white"
                        title={color}
                      />

                      <span>{color}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            colors: prev.colors.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          }))
                        }
                        className="ml-1 text-text-muted transition hover:text-error"
                        aria-label={`Remove ${color}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="mb-7">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                Sizes
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  id="new-product-size"
                  placeholder="e.g. S, M, L, XL, XXL"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;

                    event.preventDefault();

                    const value = event.currentTarget.value.trim();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.sizes.some(
                        (size) =>
                          size.toLowerCase() === value.toLowerCase()
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        sizes: [...prev.sizes, value],
                      };
                    });

                    event.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const input =
                      document.getElementById("new-product-size");

                    const value = input?.value?.trim();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.sizes.some(
                        (size) =>
                          size.toLowerCase() === value.toLowerCase()
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        sizes: [...prev.sizes, value],
                      };
                    });

                    if (input) input.value = "";
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold"
                >
                  <Plus size={15} />
                  Add Size
                </button>
              </div>

              {form.sizes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.sizes.map((size, index) => (
                    <div
                      key={`${size}-${index}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-border bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-charcoal"
                    >
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-charcoal px-1.5 text-[10px] font-bold text-white">
                        {size}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            sizes: prev.sizes.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          }))
                        }
                        className="text-text-muted transition hover:text-error"
                        aria-label={`Remove size ${size}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                Product Tags
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  id="new-product-tag"
                  placeholder="e.g. premium, thobe, luxury"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;

                    event.preventDefault();

                    const value = event.currentTarget.value
                      .trim()
                      .toLowerCase();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.tags.some(
                        (tag) => tag.toLowerCase() === value
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        tags: [...prev.tags, value],
                      };
                    });

                    event.currentTarget.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const input =
                      document.getElementById("new-product-tag");

                    const value = input?.value?.trim().toLowerCase();

                    if (!value) return;

                    setForm((prev) => {
                      const exists = prev.tags.some(
                        (tag) => tag.toLowerCase() === value
                      );

                      if (exists) return prev;

                      return {
                        ...prev,
                        tags: [...prev.tags, value],
                      };
                    });

                    if (input) input.value = "";
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold"
                >
                  <Plus size={15} />
                  Add Tag
                </button>
              </div>

              {form.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.tags.map((tag, index) => (
                    <div
                      key={`${tag}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-2 text-xs font-medium text-charcoal"
                    >
                      <span className="text-gold">#</span>
                      <span>{tag}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            tags: prev.tags.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          }))
                        }
                        className="text-text-muted transition hover:text-error"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Product Variants */}
          <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h2 className="font-serif text-xl text-charcoal">
                      Product Variants
                    </h2>

                    <p className="mt-1 text-xs text-text-muted">
                      Manage size, color, fabric, pricing, SKU, stock,
                      and variant-specific imagery.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    variants: [
                      ...prev.variants,
                      {
                        size: "",
                        color: "",
                        fabric: "",
                        sku: "",
                        price: "",
                        compareAtPrice: "",
                        stock: 0,
                        image: "",
                      },
                    ],
                  }))
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold"
              >
                <Plus size={15} />
                Add Variant
              </button>
            </div>

            {form.variants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-[#FAF9F6] px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-text-muted shadow-sm">
                  <Plus size={18} />
                </div>

                <p className="text-sm font-medium text-charcoal">
                  No variants added yet
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Add variants when a product has different sizes,
                  colors, fabrics, prices, or stock levels.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.variants.map((variant, index) => (
                  <div
                    key={`variant-${index}`}
                    className="rounded-2xl border border-border bg-[#FAF9F6] p-4 md:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                          Variant {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          {[
                            variant.size,
                            variant.color,
                            variant.fabric,
                          ]
                            .filter(Boolean)
                            .join(" • ") || "Configure variant"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            variants: prev.variants.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          }))
                        }
                        className="rounded-lg border border-error/20 px-3 py-2 text-xs font-semibold text-error transition hover:bg-error/5"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Size
                        </label>

                        <input
                          type="text"
                          value={variant.size}
                          placeholder="e.g. M"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        size: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Color
                        </label>

                        <input
                          type="text"
                          value={variant.color}
                          placeholder="e.g. White"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        color: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Fabric
                        </label>

                        <input
                          type="text"
                          value={variant.fabric}
                          placeholder="e.g. Cotton"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        fabric: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          SKU
                        </label>

                        <input
                          type="text"
                          value={variant.sku}
                          placeholder="e.g. THB-WHT-M-001"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        sku: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Variant Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={variant.price}
                          placeholder="0"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        price: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Compare-at Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={variant.compareAtPrice}
                          placeholder="Optional"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        compareAtPrice:
                                          event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          placeholder="0"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        stock: Number(
                                          event.target.value || 0
                                        ),
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>

                      <div className="md:col-span-2 xl:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-charcoal">
                          Variant Image URL
                        </label>

                        <input
                          type="url"
                          value={variant.image}
                          placeholder="https://..."
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              variants: prev.variants.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        image: event.target.value,
                                      }
                                    : item
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Product Collections */}
          <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h2 className="font-serif text-xl text-charcoal">
                      Product Collections
                    </h2>

                    <p className="mt-1 text-xs text-text-muted">
                      Add this product to one or more active collections.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
                {form.collections.length} Selected
              </div>
            </div>

            {collections.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-[#FAF9F6] px-5 py-10 text-center">
                <p className="text-sm font-medium text-charcoal">
                  No active collections available
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Create or activate a collection first to assign it to this product.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => {
                  const collectionId = String(collection?._id || "");
                  const selected = form.collections.includes(collectionId);

                  return (
                    <button
                      key={collectionId}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          collections: selected
                            ? prev.collections.filter(
                                (id) => id !== collectionId
                              )
                            : [...prev.collections, collectionId],
                        }))
                      }
                      className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-gold bg-gold/5 shadow-sm"
                          : "border-border bg-[#FAF9F6] hover:border-gold/40 hover:bg-white"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          selected
                            ? "border-gold bg-gold text-white"
                            : "border-border bg-white text-transparent group-hover:border-gold/50"
                        }`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-charcoal">
                          {collection.name}
                        </span>

                        <span className="mt-1 block truncate text-[11px] text-text-muted">
                          /{collection.slug}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {form.collections.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {form.collections.map((collectionId) => {
                  const collection = collections.find(
                    (item) => String(item?._id) === collectionId
                  );

                  if (!collection) return null;

                  return (
                    <span
                      key={collectionId}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-medium text-charcoal"
                    >
                      {collection.name}

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            collections: prev.collections.filter(
                              (id) => id !== collectionId
                            ),
                          }))
                        }
                        className="text-text-muted transition hover:text-error"
                        aria-label={`Remove ${collection.name}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </section>

          {/* Pricing */}
          <section className="border border-border bg-white p-5 md:p-7">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Commerce
              </p>
              <h2 className="mt-1 font-serif text-xl text-charcoal">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Price" required>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      event.target.value
                    )
                  }
                  className="input"
                  placeholder="5490"
                />
              </Field>

              <Field label="Compare-at Price">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAtPrice}
                  onChange={(event) =>
                    updateField(
                      "compareAtPrice",
                      event.target.value
                    )
                  }
                  className="input"
                  placeholder="6490"
                />
              </Field>

              <Field label="Cost Price">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.costPrice}
                  onChange={(event) =>
                    updateField(
                      "costPrice",
                      event.target.value
                    )
                  }
                  className="input"
                  placeholder="3200"
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Total Stock">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.totalStock}
                  onChange={(event) =>
                    updateField(
                      "totalStock",
                      event.target.value
                    )
                  }
                  className="input"
                />
              </Field>

              <Field label="Low Stock Threshold">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={(event) =>
                    updateField(
                      "lowStockThreshold",
                      event.target.value
                    )
                  }
                  className="input"
                />
              </Field>
            </div>
          </section>

          {/* SEO Settings */}
          <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">
                  Search visibility
                </p>

                <h2 className="mt-1 font-serif text-xl text-charcoal">
                  SEO Settings
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Optimize this product for search engines and social discovery.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-charcoal">
                    SEO Title
                  </label>

                  <span
                    className={`text-[10px] font-medium ${
                      form.seo.title.length > 60
                        ? "text-error"
                        : "text-text-muted"
                    }`}
                  >
                    {form.seo.title.length}/60
                  </span>
                </div>

                <input
                  type="text"
                  value={form.seo.title}
                  maxLength={70}
                  placeholder="e.g. Premium White Thobe | Thobeian"
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        title: event.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-[#FAF9F6] px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-charcoal">
                    Meta Description
                  </label>

                  <span
                    className={`text-[10px] font-medium ${
                      form.seo.description.length > 160
                        ? "text-error"
                        : "text-text-muted"
                    }`}
                  >
                    {form.seo.description.length}/160
                  </span>
                </div>

                <textarea
                  value={form.seo.description}
                  maxLength={180}
                  rows={4}
                  placeholder="Write a concise search-friendly description..."
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        description: event.target.value,
                      },
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-border bg-[#FAF9F6] px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-charcoal">
                    SEO Keywords
                  </label>

                  <span className="text-[10px] text-text-muted">
                    {form.seo.keywords.length} keywords
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Type a keyword and press Enter"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;

                    event.preventDefault();

                    const keyword = event.currentTarget.value
                      .trim()
                      .toLowerCase();

                    if (!keyword) return;

                    setForm((prev) => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        keywords: prev.seo.keywords.includes(keyword)
                          ? prev.seo.keywords
                          : [...prev.seo.keywords, keyword],
                      },
                    }));

                    event.currentTarget.value = "";
                  }}
                  className="w-full rounded-xl border border-border bg-[#FAF9F6] px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-text-muted/60 focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/10"
                />

                {form.seo.keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.seo.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-medium text-charcoal"
                      >
                        {keyword}

                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              seo: {
                                ...prev.seo,
                                keywords: prev.seo.keywords.filter(
                                  (item) => item !== keyword
                                ),
                              },
                            }))
                          }
                          className="text-text-muted transition hover:text-error"
                          aria-label={`Remove ${keyword}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Publishing */}
          <section className="border border-border bg-white p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">
                  Merchandising
                </p>
                <h2 className="font-serif text-lg text-charcoal">
                  Visibility
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <Toggle
                label="Featured Product"
                checked={form.featured}
                onChange={(value) =>
                  updateField("featured", value)
                }
              />

              <Toggle
                label="Bestseller"
                checked={form.bestseller}
                onChange={(value) =>
                  updateField("bestseller", value)
                }
              />

              <Toggle
                label="New Arrival"
                checked={form.newArrival}
                onChange={(value) =>
                  updateField("newArrival", value)
                }
              />
            </div>
          </section>

          {/* Save Card */}
          <section className="border border-gold/20 bg-background-luxury p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gold">
                <Check size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  Ready to update?
                </h3>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Your changes will be saved directly to
                  the product database.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-charcoal px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Update Product
                </>
              )}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        {label}
        {required && (
          <span className="ml-1 text-error">*</span>
        )}
      </span>

      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  loading = false,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled || loading}
        className="input appearance-none pr-11 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">
          {loading ? "Loading..." : placeholder}
        </option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-left transition hover:border-gold/40"
    >
      <span className="text-xs font-medium text-charcoal">
        {label}
      </span>

      <span
        className={`relative h-5 w-9 rounded-full transition ${
          checked
            ? "bg-gold"
            : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-[18px]"
              : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
