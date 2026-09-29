"use client";
import {
  FITS, COLLAR_TYPES, COLLAR_HEIGHTS, COLLAR_FINISHES,
  PLACKETS, BUTTON_STYLES, BUTTON_COLORS, SLEEVES, CUFFS,
  CUFF_BUTTONS, CHEST_POCKETS, SIDE_POCKETS, POCKET_STYLES,
  SIDE_DESIGNS, BOTTOM_STYLES, STITCHING_STYLES, STITCH_COLORS,
  EMBROIDERY_TYPES, EMBROIDERY_COLORS, FABRICS, FABRIC_COLORS,
  MONOGRAM_PLACEMENTS, MONOGRAM_COLORS,
  calculatePrice, BASE_PRICE,
} from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";

export default function Step22Review({ config, setStep }) {
  const total = calculatePrice(config);
  const m = config.measurements;

  const rows = [
    { label: "Fit", value: FITS.find((f) => f.id === config.fit)?.name, step: 1 },
    { label: "Collar Type", value: COLLAR_TYPES.find((c) => c.id === config.collarType)?.name, step: 2 },
    { label: "Collar Height", value: COLLAR_HEIGHTS.find((c) => c.id === config.collarHeight)?.name, step: 2 },
    { label: "Collar Finish", value: COLLAR_FINISHES.find((c) => c.id === config.collarFinish)?.name, step: 2 },
    { label: "Placket", value: PLACKETS.find((p) => p.id === config.placket)?.name, step: 4 },
    { label: "Button Style", value: BUTTON_STYLES.find((b) => b.id === config.buttonStyle)?.name, step: 5 },
    { label: "Button Color", value: BUTTON_COLORS.find((b) => b.id === config.buttonColor)?.name, step: 5 },
    { label: "Sleeve", value: SLEEVES.find((s) => s.id === config.sleeve)?.name, step: 6 },
    { label: "Cuff", value: CUFFS.find((c) => c.id === config.cuff)?.name, step: 7 },
    { label: "Cuff Button", value: CUFF_BUTTONS.find((c) => c.id === config.cuffButton)?.name, step: 8 },
    { label: "Chest Pocket", value: CHEST_POCKETS.find((p) => p.id === config.chestPocket)?.name, step: 9 },
    { label: "Side Pocket", value: SIDE_POCKETS.find((p) => p.id === config.sidePocket)?.name, step: 9 },
    { label: "Pocket Style", value: POCKET_STYLES.find((p) => p.id === config.pocketStyle)?.name, step: 9 },
    { label: "Side Design", value: SIDE_DESIGNS.find((s) => s.id === config.sideDesign)?.name, step: 13 },
    { label: "Bottom Style", value: BOTTOM_STYLES.find((b) => b.id === config.bottomStyle)?.name, step: 14 },
    { label: "Stitching", value: STITCHING_STYLES.find((s) => s.id === config.stitchingStyle)?.name, step: 15 },
    { label: "Stitch Color", value: STITCH_COLORS.find((s) => s.id === config.stitchColor)?.name, step: 15 },
    { label: "Embroidery", value: EMBROIDERY_TYPES.find((e) => e.id === config.embroidery)?.name, step: 16 },
    { label: "Embroidery Color", value: config.embroidery !== "none" ? EMBROIDERY_COLORS.find((e) => e.id === config.embroideryColor)?.name : "—", step: 16 },
    { label: "Monogram", value: config.monogramText || "—", step: 17 },
    { label: "Monogram Placement", value: config.monogramText ? MONOGRAM_PLACEMENTS.find((m) => m.id === config.monogramPlacement)?.name : "—", step: 17 },
    { label: "Fabric", value: FABRICS.find((f) => f.id === config.fabric)?.name, step: 18 },
    { label: "Fabric Color", value: FABRIC_COLORS.find((c) => c.id === config.fabricColor)?.name, step: 18 },
  ];

  const measurementRows = [
    { label: "Thobe Length", value: m.thobeLength },
    { label: "Chest", value: m.chest },
    { label: "Waist", value: m.waist },
    { label: "Hip", value: m.hip },
    { label: "Shoulder", value: m.shoulder },
    { label: "Sleeve Length", value: m.sleeveLength },
    { label: "Bicep", value: m.bicep },
    { label: "Wrist", value: m.wrist },
    { label: "Neck", value: m.neck },
    { label: "Bottom Opening", value: m.bottomOpening },
    { label: "Side Slit", value: m.sideSlitLength },
  ];

  return (
    <div className="space-y-6">
      {/* Measurements */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-3 flex items-center gap-2">
          📏 Measurements
          <button onClick={() => setStep(0)} className="text-[10px] text-gold hover:underline ml-auto">Edit</button>
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {measurementRows.map((r) => (
            <div key={r.label} className="flex justify-between p-2 bg-background-luxury border border-border">
              <span className="text-text-muted truncate">{r.label}</span>
              <span className="text-charcoal font-medium">{r.value ? `${r.value}"` : "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Design Config */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-3">🎨 Design Configuration</h3>
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between p-2.5 border-b border-border text-xs">
              <span className="text-text-muted">{r.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-charcoal font-medium capitalize text-right">{r.value || "—"}</span>
                <button onClick={() => setStep(r.step)} className="text-[10px] text-gold hover:underline shrink-0">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Request */}
      {config.specialRequest && (
        <div>
          <h3 className="font-serif text-lg text-charcoal mb-2">💬 Special Request</h3>
          <div className="p-3 bg-background-luxury border border-border text-xs text-text-secondary italic">
            "{config.specialRequest}"
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="border-t-2 border-gold pt-4">
        <h3 className="font-serif text-lg text-charcoal mb-3">💰 Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Base Custom Thobe</span>
            <span className="text-charcoal">{formatPrice(BASE_PRICE)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Additional Customization</span>
            <span className="text-charcoal">{formatPrice(total - BASE_PRICE - 500)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Measurement / Fitting</span>
            <span className="text-charcoal">{formatPrice(500)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-serif text-lg text-charcoal">Total</span>
            <span className="font-serif text-2xl text-gold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
