"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "@/lib/toast";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Share2,
  ShoppingBag,
  RotateCcw,
  Check,
  Menu,
  X,
  ClipboardCheck,
} from "lucide-react";
import { useCustomizerStore } from "@/store/customizerStore";
import { FABRICS, FABRIC_COLORS, calculatePrice } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import ThobePreview from "@/components/customizer/ThobePreview";

// Step imports
import Step01Measurements from "@/components/customizer/steps/Step01Measurements";
import Step02Fit from "@/components/customizer/steps/Step02Fit";
import Step03Collar from "@/components/customizer/steps/Step03Collar";
import Step04CollarContrast from "@/components/customizer/steps/Step04CollarContrast";
import Step05Placket from "@/components/customizer/steps/Step05Placket";
import Step06Buttons from "@/components/customizer/steps/Step06Buttons";
import Step07Sleeve from "@/components/customizer/steps/Step07Sleeve";
import Step08Cuff from "@/components/customizer/steps/Step08Cuff";
import Step09CuffButton from "@/components/customizer/steps/Step09CuffButton";
import Step10Pocket from "@/components/customizer/steps/Step10Pocket";
import Step11PocketContrast from "@/components/customizer/steps/Step11PocketContrast";
import Step12SleeveContrast from "@/components/customizer/steps/Step12SleeveContrast";
import Step13PlacketContrast from "@/components/customizer/steps/Step13PlacketContrast";
import Step14SideDesign from "@/components/customizer/steps/Step14SideDesign";
import Step15Bottom from "@/components/customizer/steps/Step15Bottom";
import Step16Stitching from "@/components/customizer/steps/Step16Stitching";
import Step17Embroidery from "@/components/customizer/steps/Step17Embroidery";
import Step18Monogram from "@/components/customizer/steps/Step18Monogram";
import Step19Fabric from "@/components/customizer/steps/Step19Fabric";
import Step20SpecialRequest from "@/components/customizer/steps/Step20SpecialRequest";
import Step21Confirmation from "@/components/customizer/steps/Step21Confirmation";
import Step22Review from "@/components/customizer/steps/Step22Review";

const STEPS = [
  { id: 0, label: "Measurements", component: Step01Measurements },
  { id: 1, label: "Fit", component: Step02Fit },
  { id: 2, label: "Collar", component: Step03Collar },
  { id: 3, label: "Collar Contrast", component: Step04CollarContrast },
  { id: 4, label: "Placket", component: Step05Placket },
  { id: 5, label: "Buttons", component: Step06Buttons },
  { id: 6, label: "Sleeve", component: Step07Sleeve },
  { id: 7, label: "Cuff", component: Step08Cuff },
  { id: 8, label: "Cuff Button", component: Step09CuffButton },
  { id: 9, label: "Pocket", component: Step10Pocket },
  { id: 10, label: "Pocket Contrast", component: Step11PocketContrast },
  { id: 11, label: "Sleeve Contrast", component: Step12SleeveContrast },
  { id: 12, label: "Placket Contrast", component: Step13PlacketContrast },
  { id: 13, label: "Side Design", component: Step14SideDesign },
  { id: 14, label: "Bottom / Hem", component: Step15Bottom },
  { id: 15, label: "Stitching", component: Step16Stitching },
  { id: 16, label: "Embroidery", component: Step17Embroidery },
  { id: 17, label: "Monogram", component: Step18Monogram },
  { id: 18, label: "Fabric & Color", component: Step19Fabric },
  { id: 19, label: "Special Request", component: Step20SpecialRequest },
  { id: 20, label: "Confirmation", component: Step21Confirmation },
  { id: 21, label: "Review & Price", component: Step22Review },
];

export default function CustomThobePage() {
  const router = useRouter();
  const {
    config,
    currentStep,
    setStep,
    nextStep,
    prevStep,
    updateConfig,
    updateMeasurement,
    getPrice,
    resetConfig,
    designId,
    setDesignId,
  } = useCustomizerStore();

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const price = getPrice();
  const isLastStep = currentStep === STEPS.length - 1;

  // Check if all confirmations are done
  const allConfirmed =
    config.confirmMeasurements &&
    config.confirmFitting &&
    config.confirmChecked;

  const CurrentStepComponent = STEPS[currentStep]?.component;

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await axios.post("/api/custom-thobe", {
        config,
        name: "My Custom Thobe",
      });
      setDesignId(data.data.designId);
      toast.success(`Design saved! ID: ${data.data.designId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (!designId) {
      toast.error("Please save design first");
      return;
    }
    const url = `${window.location.origin}/custom-thobe?design=${designId}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  };

  const handleAddToCart = () => {
    if (!designId) {
      toast.error("Please save your design first");
      return;
    }
    toast.success("Added to cart! (Coming soon)");
  };

  // ===== PLACE ORDER — Main Submit =====
  const handlePlaceOrder = async () => {
    // Validation
    if (!allConfirmed) {
      toast.error("Please confirm all checkboxes before ordering");
      setStep(20); // Go back to Confirmation step
      return;
    }

    // Check required measurements
    const requiredMeasurements = ["thobeLength", "chest", "waist", "shoulder", "sleeveLength"];
    const missing = requiredMeasurements.filter(
      (key) => !config.measurements[key]
    );
    if (missing.length > 0) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      setStep(0); // Go back to measurements
      return;
    }

    try {
      setSubmitting(true);

      // First save design if not saved
      let finalDesignId = designId;
      if (!finalDesignId) {
        const { data } = await axios.post("/api/custom-thobe", {
          config,
          name: "My Custom Thobe",
        });
        finalDesignId = data.data.designId;
        setDesignId(finalDesignId);
      }

      toast.success("Design submitted successfully!");
      
      // Redirect to success page
      router.push(`/custom-thobe/success?design=${finalDesignId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all customization?")) {
      resetConfig();
      toast.success("Design reset");
    }
  };

  return (
    <div className="min-h-screen bg-background-luxury">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="hidden lg:flex text-sm text-text-secondary hover:text-gold items-center gap-1"
            >
              <ArrowLeft size={16} /> Home
            </Link>
            <h1 className="font-serif text-base md:text-xl text-charcoal flex-1 text-center lg:text-left">
              Custom Thobe Designer
            </h1>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right mr-2">
                <p className="text-[10px] text-text-muted">Total</p>
                <p className="font-serif text-lg text-charcoal">
                  {formatPrice(price)}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-text-secondary hover:text-error transition-colors"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden overflow-y-auto">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <p className="font-serif text-lg">Steps</p>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X size={20} />
            </button>
          </div>
          <div className="p-3 space-y-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStep(s.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                  currentStep === s.id
                    ? "bg-gold/10 text-gold border-l-2 border-gold font-medium"
                    : "text-text-secondary hover:bg-background-luxury border-l-2 border-transparent"
                }`}
              >
                <span className="text-[10px] w-6">
                  {String(s.id + 1).padStart(2, "0")}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid lg:grid-cols-12 gap-5">
          {/* LEFT: Steps */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="bg-white border border-border p-3 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 px-2">
                Steps
              </p>
              <div className="space-y-0.5">
                {STEPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex items-center gap-1.5 ${
                      currentStep === s.id
                        ? "bg-gold/10 text-gold border-l-2 border-gold font-medium"
                        : "text-text-secondary hover:text-charcoal hover:bg-background-luxury border-l-2 border-transparent"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">
                      {String(s.id + 1).padStart(2, "0")}
                    </span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER: Preview + Step */}
          <main className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-border p-5">
              <div className="aspect-[3/4] max-w-sm mx-auto">
                <ThobePreview config={config} />
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  Live Preview
                </p>
              </div>
            </div>

            <div className="bg-white border border-border p-5">
              <div className="mb-4">
                <p className="text-[10px] text-gold uppercase tracking-widest mb-1">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h2 className="font-serif text-xl text-charcoal">
                  {STEPS[currentStep].label}
                </h2>
              </div>

              {CurrentStepComponent && (
                <CurrentStepComponent
                  config={config}
                  updateConfig={updateConfig}
                  updateMeasurement={updateMeasurement}
                  setStep={setStep}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-border">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="btn-outline text-xs py-2.5 px-4 disabled:opacity-30 flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                {/* STEP 22 — Place Order */}
                {isLastStep ? (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting || !allConfirmed}
                    className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <ClipboardCheck size={14} /> Place Order
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Hint — for last step */}
              {isLastStep && !allConfirmed && (
                <p className="mt-3 text-[10px] text-warning text-center">
                  ⚠️ Please complete Step 21 (Confirmation) to enable Place Order
                </p>
              )}
            </div>
          </main>

          {/* RIGHT: Summary */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-border p-5 lg:sticky lg:top-20">
              <p className="text-[10px] uppercase tracking-widest text-gold mb-1">
                Your Custom Thobe
              </p>
              <h3 className="font-serif text-lg text-charcoal mb-4">
                Quick Summary
              </h3>

              {designId && (
                <div className="mb-4 p-3 bg-success/5 border border-success/30 flex items-center gap-2">
                  <Check size={14} className="text-success shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-success">
                      Design ID
                    </p>
                    <p className="text-xs font-mono text-charcoal truncate">
                      {designId}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs mb-4">
                <Row
                  label="Fabric"
                  value={FABRICS.find((f) => f.id === config.fabric)?.name}
                />
                <Row
                  label="Color"
                  value={
                    FABRIC_COLORS.find((c) => c.id === config.fabricColor)?.name
                  }
                />
                <Row label="Fit" value={config.fit} />
                <Row label="Collar" value={config.collarType} />
              </div>

              <div className="border-t border-border pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">Total</span>
                  <span className="font-serif text-2xl text-charcoal">
                    {formatPrice(price)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving
                    ? "Saving..."
                    : designId
                    ? "Update Design"
                    : "Save Design"}
                </button>
                <button
                  onClick={handleShare}
                  disabled={!designId}
                  className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <Share2 size={14} /> Share Design
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!designId}
                  className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>

              {!designId && (
                <p className="text-[10px] text-text-muted text-center mt-3">
                  Save your design to unlock Share & Cart
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-muted capitalize">{label}</span>
      <span className="text-charcoal font-medium truncate text-right capitalize">
        {value}
      </span>
    </div>
  );
}
