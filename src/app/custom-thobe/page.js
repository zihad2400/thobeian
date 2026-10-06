"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "@/lib/toast";

import { useCartStore } from "@/store/cartStore";
import {
  BASE_PRICE,
  FABRICS,
  FABRIC_COLORS,
  FITS,
  COLLAR_TYPES,
  PLACKETS,
  BUTTON_STYLES,
  SLEEVES,
  CUFFS,
  CHEST_POCKETS,
  SIDE_POCKETS,
  calculatePrice,
} from "@/config/customThobe";

import ThobePreview from "@/components/customizer/ThobePreview";

const STEPS = [
  {
    id: "fabric",
    label: "Fabric",
    title: "Choose your fabric",
  },
  {
    id: "style",
    label: "Style",
    title: "Choose your style",
  },
  {
    id: "details",
    label: "Details",
    title: "Refine the details",
  },
  {
    id: "size",
    label: "Size",
    title: "Choose your size",
  },
  {
    id: "preview",
    label: "Preview",
    title: "Review your thobe",
  },
];

const SIZE_OPTIONS = [
  { value: "S", label: "S", desc: "Small" },
  { value: "M", label: "M", desc: "Medium" },
  { value: "L", label: "L", desc: "Large" },
  { value: "XL", label: "XL", desc: "Extra Large" },
  { value: "XXL", label: "2XL", desc: "Extra Extra Large" },
];

const DEFAULT_CONFIG = {
  fabric: "premium-cotton",
  fabricColor: "white",

  fit: "regular",

  collarType: "mandarin",
  collarHeight: "medium",

  placket: "hidden",
  buttonStyle: "normal-hole",
  buttonColor: "matching",

  sleeve: "straight",
  cuff: "standard",

  chestPocket: "none",
  sidePocket: "none",

  sideDesign: "plain",
  bottomStyle: "straight",

  stitchingStyle: "matching",
  stitchColor: "matching",

  embroidery: "none",
  embroideryColor: "matching",
  monogramText: "",
  monogramPlacement: "chest",
  monogramColor: "gold",

  size: "",
  measurements: {},

  specialRequest: "",
};

function OptionCard({
  active,
  title,
  description,
  price,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[#C8A96B] bg-[#FBF7EF] shadow-[0_8px_30px_rgba(200,169,107,0.12)]"
          : "border-[#E8E1D6] bg-white hover:border-[#CFC3B2] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-medium text-[#1F1F1F]">
            {title}
          </div>

          {description ? (
            <div className="mt-1 text-xs leading-5 text-[#77716A]">
              {description}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {price > 0 ? (
            <span className="text-xs font-medium text-[#9A7842]">
              +৳{price.toLocaleString("en-BD")}
            </span>
          ) : null}

          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              active
                ? "border-[#C8A96B] bg-[#C8A96B]"
                : "border-[#D7CFC3]"
            }`}
          >
            {active ? (
              <span className="h-2 w-2 rounded-full bg-white" />
            ) : null}
          </span>
        </div>
      </div>
    </button>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A7834A]">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-[#1F1F1F]">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716A]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function getOption(list, value) {
  return list?.find((item) => item.id === value);
}

function CustomThobePageContent() {
  const searchParams = useSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);

  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [designId, setDesignId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const previewRef = useRef(null);

  const [loaded, setLoaded] = useState(
    () => !searchParams.get("designId")
  );

  const price = useMemo(
    () => calculatePrice(config),
    [config]
  );

  const currentStep = STEPS[step];

  function updateConfig(key, value) {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function loadExistingDesign(id) {
    try {
      setSaving(true);

      const response = await axios.get(
        `/api/custom-thobe/${encodeURIComponent(id)}`
      );

      const design =
        response.data?.data?.design ||
        response.data?.design;

      if (!design) {
        throw new Error("Design not found");
      }

      setDesignId(design.designId);
      setConfig({
        ...DEFAULT_CONFIG,
        ...(design.config || {}),
      });

      toast.success("Custom design loaded");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Unable to load this design"
      );
    } finally {
      setSaving(false);
      setLoaded(true);
    }
  }

  useEffect(() => {
    const id = searchParams.get("designId");

    if (!id) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const response = await axios.get(`/api/custom-thobe/${id}`);

        if (cancelled) return;

        const loadedDesign = response.data?.data?.design;

        if (loadedDesign?.config) {
          setConfig((current) => ({
            ...current,
            ...loadedDesign.config,
          }));
        }

        if (loadedDesign?.designId) {
          setDesign(loadedDesign);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Load custom design error:", error);
          toast.error(
            error.response?.data?.message ||
              "Failed to load custom design"
          );
        }
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  function createPreviewImage() {
    const svg = previewRef.current;

    if (!svg) {
      console.warn("Custom thobe preview SVG is not available.");
      return "";
    }

    try {
      const clone = svg.cloneNode(true);

      clone.setAttribute(
        "xmlns",
        "http://www.w3.org/2000/svg"
      );

      clone.setAttribute(
        "xmlns:xlink",
        "http://www.w3.org/1999/xlink"
      );

      clone.setAttribute("width", "900");
      clone.setAttribute("height", "1650");

      const svgString =
        new XMLSerializer().serializeToString(clone);

      const previewImage =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgString);

      console.log(
        "[CUSTOM THOBE PREVIEW]",
        {
          svgExists: Boolean(svg),
          svgLength: svgString.length,
          previewLength: previewImage.length,
          previewPrefix: previewImage.slice(0, 80),
        }
      );

      return previewImage;
    } catch (error) {
      console.error(
        "Failed to generate custom thobe preview:",
        error
      );

      return "";
    }
  }

  async function saveDesign() {
    try {
      setSaving(true);

      const response = await axios.post(
        "/api/custom-thobe",
        {
          designId,
          config,
          name: "Custom Thobe",
          previewImage: createPreviewImage(),
        }
      );

      const design =
        response.data?.data?.design ||
        response.data?.design;

      if (design?.designId) {
        setDesignId(design.designId);
      }

      return design;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save your design"
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function handleAddToCart() {
    if (!config.size) {
      toast.error("Please select your size first.");
      setStep(3);
      return;
    }

    try {
      setAdding(true);

      /*
       * ONE-REQUEST CUSTOM THOBE FLOW
       *
       * The cart API now creates/updates the design and
       * adds it to the cart in the same server request.
       *
       * This removes the previous sequential:
       * saveDesign() -> addToCart()
       * production latency.
       */

      const previewImage = createPreviewImage();

      const added = await addToCart(
        null,
        {
          isCustom: true,
          customDesignId: designId || "",
          customConfig: config,
          customName: "Custom Thobe",
          customPreviewImage: previewImage,
          quantity: 1,
        }
      );

      if (!added) {
        throw new Error(
          "Custom thobe could not be added to cart"
        );
      }

      toast.success(
        "Your custom thobe has been added to cart."
      );

      setStep(4);
    } catch (error) {
      console.error(error);

      if (
        !error?.response?.data?.message &&
        !error?.message?.includes("cart")
      ) {
        toast.error(
          "Could not add your custom thobe to cart."
        );
      }
    } finally {
      setAdding(false);
    }
  }

  function next() {
    if (step === 3 && !config.size) {
      toast.error("Please select your size.");
      return;
    }

    setStep((value) =>
      Math.min(value + 1, STEPS.length - 1)
    );
  }

  function previous() {
    setStep((value) =>
      Math.max(value - 1, 0)
    );
  }

  function reset() {
    setConfig(DEFAULT_CONFIG);
    setDesignId(null);
    setStep(0);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#FAF9F6] px-5 py-20">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-56 rounded bg-[#EEE8DE]" />
          <div className="mt-4 h-4 w-96 max-w-full rounded bg-[#EEE8DE]" />
          <div className="mt-10 h-[500px] rounded-3xl bg-[#F1ECE4]" />
        </div>
      </main>
    );
  }

  const fabric = getOption(FABRICS, config.fabric);
  const fabricColor = getOption(
    FABRIC_COLORS,
    config.fabricColor
  );

  const collar = getOption(
    COLLAR_TYPES,
    config.collarType
  );

  const placket = getOption(
    PLACKETS,
    config.placket
  );

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FAF9F6] text-[#1F1F1F]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A7834A]">
              THOBEIAN CUSTOM
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Design your thobe
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77716A]">
              Choose the essentials, see your thobe evolve,
              and create a piece made for you.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="self-start rounded-full border border-[#DDD4C7] bg-white px-4 py-2 text-xs font-medium text-[#625C55] transition hover:border-[#C8A96B] hover:text-[#8D6D3D] md:self-auto"
          >
            Start over
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max items-center">
            {STEPS.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center"
              >
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      index <= step
                        ? "bg-[#C8A96B] text-white shadow-[0_6px_20px_rgba(200,169,107,0.28)]"
                        : "bg-[#1F1F1F] text-white"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      index === step
                        ? "text-[#1F1F1F]"
                        : "text-[#8A847C]"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>

                {index < STEPS.length - 1 ? (
                  <span className="mx-3 h-px w-8 bg-[#DED6CA] sm:mx-5 sm:w-14" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">

          {/* Options */}
          <section className="rounded-[28px] border border-[#E7E0D6] bg-white p-5 shadow-[0_12px_45px_rgba(31,31,31,0.04)] sm:p-8">

            {step === 0 ? (
              <>
                <SectionTitle
                  eyebrow="01 / Fabric"
                  title="Start with the fabric"
                  description="Choose a fabric that matches how you want your thobe to feel and wear."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {FABRICS.map((item, index) => (
                    <OptionCard key={`${item.id || item.name || "option"}-${index}`}
                      active={
                        config.fabric === item.id
                      }
                      title={item.name}
                      description={item.description}
                      price={item.price}
                      onClick={() =>
                        updateConfig(
                          "fabric",
                          item.id
                        )
                      }
                    />
                  ))}
                </div>

                <div className="mt-8">
                  <div className="mb-4 text-sm font-semibold">
                    Colour
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {FABRIC_COLORS.map((item, index) => (
                      <button
                        key={`${item.id || item.name || "option"}-${index}`}
                        type="button"
                        onClick={() =>
                          updateConfig(
                            "fabricColor",
                            item.id
                          )
                        }
                        className={`rounded-2xl border p-3 text-left transition ${
                          config.fabricColor ===
                          item.id
                            ? "border-[#C8A96B] bg-[#FBF7EF]"
                            : "border-[#E8E1D6] bg-white hover:border-[#CFC3B2]"
                        }`}
                      >
                        <span
                          className="mb-2 block h-9 w-full rounded-xl border border-black/10"
                          style={{
                            background:
                              item.color ||
                              item.hex ||
                              "#F5F2EC",
                          }}
                        />

                        <span className="text-xs font-medium">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <SectionTitle
                  eyebrow="02 / Style"
                  title="Define the silhouette"
                  description="Keep it classic, relaxed or refined. Your core style stays clean and timeless."
                />

                <div className="mb-8">
                  <div className="mb-4 text-sm font-semibold">
                    Fit
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {FITS.map((item, index) => (
                      <OptionCard
                        key={`${item.id}-${index}`}
                        active={config.fit === item.id}
                        title={item.name}
                        description={
                          item.id === "regular"
                            ? "Balanced everyday fit"
                            : item.id === "comfort"
                              ? "More relaxed through the body"
                              : item.id === "slim"
                                ? "Clean contemporary silhouette"
                                : "Extra room and ease"
                        }
                        price={item.price}
                        onClick={() => updateConfig("fit", item.id)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 text-sm font-semibold">
                    Collar
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {COLLAR_TYPES.map((item, index) => (
                      <OptionCard key={`${item.id || item.name || "option"}-${index}`}
                        active={
                          config.collarType ===
                          item.id
                        }
                        title={item.name}
                        description={
                          item.description
                        }
                        price={item.price}
                        onClick={() =>
                          updateConfig(
                            "collarType",
                            item.id
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <SectionTitle
                  eyebrow="03 / Details"
                  title="Add the finishing details"
                  description="A few carefully selected details are enough to make the thobe yours."
                />

                <div className="space-y-8">
                  <div>
                    <div className="mb-4 text-sm font-semibold">
                      Placket
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {PLACKETS.map((item, index) => (
                        <OptionCard key={`${item.id || item.name || "option"}-${index}`}
                          active={
                            config.placket ===
                            item.id
                          }
                          title={item.name}
                          description={
                            item.description
                          }
                          price={item.price}
                          onClick={() =>
                            updateConfig(
                              "placket",
                              item.id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 text-sm font-semibold">
                      Sleeves
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {SLEEVES.map((item, index) => (
                        <OptionCard key={`${item.id || item.name || "option"}-${index}`}
                          active={
                            config.sleeve ===
                            item.id
                          }
                          title={item.name}
                          description={
                            item.description
                          }
                          price={item.price}
                          onClick={() =>
                            updateConfig(
                              "sleeve",
                              item.id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 text-sm font-semibold">
                      Cuffs
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {CUFFS.map((item, index) => (
                        <OptionCard key={`${item.id || item.name || "option"}-${index}`}
                          active={
                            config.cuff ===
                            item.id
                          }
                          title={item.name}
                          description={
                            item.description
                          }
                          price={item.price}
                          onClick={() =>
                            updateConfig(
                              "cuff",
                              item.id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 text-sm font-semibold">
                      Pockets
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {CHEST_POCKETS.map((item, index) => (
                          <OptionCard
                            key={`chest-${item.id || item.name || "option"}-${index}`}
                            active={
                              config.chestPocket ===
                              item.id
                            }
                            title={`Chest: ${item.name}`}
                            description={
                              item.description
                            }
                            price={item.price}
                            onClick={() =>
                              updateConfig(
                                "chestPocket",
                                item.id
                              )
                            }
                          />
                        )
                      )}

                      {SIDE_POCKETS.map((item, index) => (
                          <OptionCard
                            key={`side-${item.id || item.name || "option"}-${index}`}
                            active={
                              config.sidePocket ===
                              item.id
                            }
                            title={`Side: ${item.name}`}
                            description={
                              item.description
                            }
                            price={item.price}
                            onClick={() =>
                              updateConfig(
                                "sidePocket",
                                item.id
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 text-sm font-semibold">
                      Monogram
                    </div>

                    <div className="flex gap-3">
                      {[
                        {
                          value: "none",
                          label: "No monogram",
                        },
                        {
                          value: "chest",
                          label: "Chest monogram",
                        },
                      ].map((item, index) => (
                        <button
                          key={`${item.id || item.name || "option"}-${index}`}
                          type="button"
                          onClick={() =>
                            updateConfig(
                              "embroidery",
                              item.id ===
                                "none"
                                ? "none"
                                : "monogram"
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                            (
                              item.id ===
                              "none"
                                ? config.embroidery ===
                                  "none"
                                : config.embroidery ===
                                  "monogram"
                            )
                              ? "border-[#C8A96B] bg-[#FBF7EF] text-[#8D6D3D]"
                              : "border-[#DDD4C7] bg-white text-[#625C55]"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {config.embroidery ===
                    "monogram" ? (
                      <input
                        value={
                          config.monogramText
                        }
                        onChange={(event) =>
                          updateConfig(
                            "monogramText",
                            event.target.value
                              .slice(0, 8)
                              .toUpperCase()
                          )
                        }
                        placeholder="Your initials"
                        className="mt-4 w-full rounded-xl border border-[#DDD4C7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C8A96B]"
                      />
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <SectionTitle
                  eyebrow="04 / Size"
                  title="Choose your size"
                  description="Select your usual thobe size. Custom measurements can be added later when your order is confirmed."
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      id: "M",
                      name: "M",
                      description: "Medium",
                      price: 0,
                    },
                    {
                      id: "L",
                      name: "L",
                      description: "Large",
                      price: 0,
                    },
                    {
                      id: "XL",
                      name: "XL",
                      description: "Extra Large",
                      price: 0,
                    },
                    {
                      id: "2XL",
                      name: "2XL",
                      description: "Extra Extra Large",
                      price: 0,
                    },
                    {
                      id: "3XL",
                      name: "3XL",
                      description: "3XL",
                      price: 0,
                    },
                  ].map((item, index) => (
                    <OptionCard
                      key={`${item.id}-${index}`}
                      active={config.size === item.id}
                      title={item.name}
                      description={item.description}
                      price={item.price}
                      onClick={() => updateConfig("size", item.id)}
                    />
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#E8E1D6] bg-[#FBF9F5] p-5">
                  <div className="text-sm font-semibold text-[#1F1F1F]">
                    Need a specific fit?
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#77716A]">
                    After checkout, our team can confirm the measurements
                    required for your custom thobe before production.
                  </p>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <SectionTitle
                  eyebrow="05 / Preview"
                  title="Your thobe is ready"
                  description="Review the configuration below before adding your custom thobe to the cart."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Fabric
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {fabric?.label ||
                        config.fabric}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Colour
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {fabricColor?.label ||
                        config.fabricColor}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Collar
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {collar?.label ||
                        config.collarType}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Placket
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {placket?.label ||
                        config.placket}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Size
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      {config.size}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FCFAF6] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#A7834A]">
                      Fit
                    </div>
                    <div className="mt-2 text-sm font-semibold capitalize">
                      {config.fit}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#E6DCCB] bg-[#FBF7EF] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Custom Thobe
                    </span>

                    <span className="text-lg font-semibold">
                      ৳{price.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-[#EEE8DE] pt-6">
              <button
                type="button"
                onClick={previous}
                disabled={step === 0}
                className="rounded-full border border-[#DDD4C7] bg-white px-5 py-3 text-xs font-semibold text-[#625C55] transition hover:border-[#C8A96B] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-[#1F1F1F] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#34312D]"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || saving}
                  className="rounded-full bg-[#1F1F1F] px-7 py-3 text-xs font-semibold text-white transition hover:bg-[#34312D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {adding
                    ? "Adding..."
                    : "Add custom thobe to cart"}
                </button>
              )}
            </div>
          </section>

          {/* Preview */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-[#E7E0D6] bg-white shadow-[0_12px_45px_rgba(31,31,31,0.05)]">

              <div className="border-b border-[#EEE8DE] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A7834A]">
                      Live preview
                    </div>

                    <div className="mt-1 text-lg font-semibold">
                      Your custom thobe
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[#8A847C]">
                      Starting from
                    </div>
                    <div className="text-lg font-semibold">
                      ৳{price.toLocaleString("en-BD")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-[560px] bg-[#F5F1E9] p-4">
                <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-[22px] bg-[#FAF9F6]">
                  <ThobePreview
                    ref={previewRef}
                    config={config}
                  />
                </div>
              </div>

              <div className="border-t border-[#EEE8DE] p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9A938A]">
                      Fabric
                    </div>
                    <div className="mt-1 truncate text-xs font-medium">
                      {fabric?.label ||
                        config.fabric}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9A938A]">
                      Colour
                    </div>
                    <div className="mt-1 truncate text-xs font-medium">
                      {fabricColor?.label ||
                        config.fabricColor}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9A938A]">
                      Style
                    </div>
                    <div className="mt-1 truncate text-xs font-medium">
                      {collar?.label ||
                        config.collarType}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9A938A]">
                      Size
                    </div>
                    <div className="mt-1 text-xs font-medium">
                      {config.size || "Not selected"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


export default function CustomThobePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6] px-4 py-12">
          <div className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#E7E0D6] border-t-[#C8A96B]" />
              <p className="mt-4 text-sm text-[#77716A]">
                Loading custom thobe studio...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <CustomThobePageContent />
    </Suspense>
  );
}
