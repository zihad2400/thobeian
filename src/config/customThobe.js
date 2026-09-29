// ================================================================
// THOBEIAN CUSTOM THOBE — Complete Configuration
// Based on Measurement & Design Form
// ================================================================

export const BASE_PRICE = 4500;

// ================================================================
// SECTION 02 — FIT
// ================================================================
export const FITS = [
  { id: "regular", name: "Regular Fit", price: 0 },
  { id: "comfort", name: "Comfort Fit", price: 200 },
  { id: "slim", name: "Slim Fit", price: 300 },
  { id: "relaxed", name: "Relaxed Fit", price: 0 },
];

// ================================================================
// SECTION 03 — COLLAR DESIGN
// ================================================================
export const COLLAR_TYPES = [
  { id: "band", name: "Band Collar", price: 300 },
  { id: "mandarin", name: "Mandarin Collar", price: 300 },
  { id: "classic", name: "Classic Collar", price: 300 },
  { id: "royal", name: "Royal Collar", price: 500 },
  { id: "round", name: "Round Collar", price: 350 },
  { id: "emirati", name: "Emirati Style Collar", price: 500 },
  { id: "custom", name: "Custom Collar", price: 600 },
];

export const COLLAR_HEIGHTS = [
  { id: "low", name: "Low", price: 0 },
  { id: "medium", name: "Medium", price: 0 },
  { id: "high", name: "High", price: 100 },
];

export const COLLAR_FINISHES = [
  { id: "standard", name: "Standard", price: 0 },
  { id: "premium", name: "Premium", price: 200 },
];

// ================================================================
// SECTION 04 — COLLAR CONTRAST
// ================================================================
export const CONTRAST_OPTIONS = [
  { id: "none", name: "No Contrast", price: 0 },
  { id: "same-fabric", name: "Same Fabric", price: 0 },
  { id: "contrast-fabric", name: "Contrast Fabric", price: 250 },
  { id: "contrast-color", name: "Contrast Color", price: 200 },
];

// ================================================================
// SECTION 05 — PLACKET DESIGN
// ================================================================
export const PLACKETS = [
  { id: "hidden", name: "Hidden Placket", price: 0 },
  { id: "normal-button", name: "Normal Button Placket", price: 100 },
  { id: "royal", name: "Royal Placket", price: 450 },
  { id: "half", name: "Half Placket", price: 250 },
  { id: "full", name: "Full Placket", price: 300 },
  { id: "snap", name: "Snap Button Placket", price: 200 },
];

// ================================================================
// SECTION 06 — BUTTON TYPE
// ================================================================
export const BUTTON_STYLES = [
  { id: "normal-hole", name: "Normal Hole Button", price: 0 },
  { id: "snap", name: "Snap Button", price: 150 },
  { id: "hidden", name: "Hidden Button", price: 100 },
  { id: "premium-metal", name: "Premium Metal Button", price: 400 },
];

export const BUTTON_COLORS = [
  { id: "matching", name: "Matching", hex: null },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
  { id: "gold", name: "Gold", hex: "#C8A96B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
  { id: "brown", name: "Brown", hex: "#6B4423" },
];

// ================================================================
// SECTION 07 — SLEEVE DESIGN
// ================================================================
export const SLEEVES = [
  { id: "straight", name: "Standard Straight Sleeve", price: 0 },
  { id: "slim", name: "Slim Sleeve", price: 150 },
  { id: "relaxed", name: "Relaxed Sleeve", price: 100 },
  { id: "wide", name: "Wide Sleeve", price: 200 },
  { id: "tapered", name: "Tapered Sleeve", price: 150 },
  { id: "custom", name: "Custom Sleeve", price: 300 },
];

// ================================================================
// SECTION 08 — CUFF DESIGN
// ================================================================
export const CUFFS = [
  { id: "none", name: "No Cuff / Plain Sleeve", price: 0 },
  { id: "standard", name: "Standard Cuff", price: 0 },
  { id: "button", name: "Button Cuff", price: 200 },
  { id: "french", name: "French Cuff", price: 400 },
  { id: "double", name: "Double Cuff", price: 350 },
  { id: "royal", name: "Royal Cuff", price: 500 },
];

// ================================================================
// SECTION 09 — CUFF BUTTON
// ================================================================
export const CUFF_BUTTONS = [
  { id: "none", name: "No Button", price: 0 },
  { id: "normal", name: "Normal Button", price: 0 },
  { id: "snap", name: "Snap Button", price: 100 },
  { id: "premium", name: "Premium Button", price: 250 },
];

// ================================================================
// SECTION 10 — POCKET DESIGN
// ================================================================
export const CHEST_POCKETS = [
  { id: "none", name: "No Pocket", price: 0 },
  { id: "left", name: "Left Chest Pocket", price: 200 },
  { id: "right", name: "Right Chest Pocket", price: 200 },
  { id: "both", name: "Both", price: 350 },
];

export const SIDE_POCKETS = [
  { id: "none", name: "No Pocket", price: 0 },
  { id: "left", name: "Left Side", price: 150 },
  { id: "right", name: "Right Side", price: 150 },
  { id: "both", name: "Both Sides", price: 250 },
];

export const POCKET_STYLES = [
  { id: "hidden", name: "Hidden", price: 0 },
  { id: "straight", name: "Straight", price: 0 },
  { id: "slanted", name: "Slanted", price: 100 },
  { id: "traditional", name: "Traditional", price: 0 },
  { id: "premium", name: "Premium", price: 200 },
];

// ================================================================
// SECTION 11 — POCKET CONTRAST
// ================================================================
export const POCKET_CONTRAST = [
  { id: "no", name: "No", price: 0 },
  { id: "contrast-fabric", name: "Yes — Contrast Fabric", price: 200 },
  { id: "contrast-color", name: "Yes — Contrast Color", price: 150 },
];

// ================================================================
// SECTION 12 — SLEEVE CONTRAST
// ================================================================
export const SLEEVE_CONTRAST = [
  { id: "none", name: "No Contrast", price: 0 },
  { id: "cuff", name: "Contrast Cuff", price: 250 },
  { id: "panel", name: "Contrast Sleeve Panel", price: 300 },
  { id: "stitching", name: "Contrast Stitching", price: 150 },
];

// ================================================================
// SECTION 13 — PLACKET CONTRAST
// ================================================================
export const PLACKET_CONTRAST = [
  { id: "none", name: "No Contrast", price: 0 },
  { id: "fabric", name: "Contrast Fabric", price: 250 },
  { id: "color", name: "Contrast Color", price: 200 },
  { id: "stitching", name: "Contrast Stitching", price: 150 },
];

// ================================================================
// SECTION 14 — SIDE DESIGN
// ================================================================
export const SIDE_DESIGNS = [
  { id: "plain", name: "Plain Side", price: 0 },
  { id: "standard-slit", name: "Standard Side Slit", price: 0 },
  { id: "deep-slit", name: "Deep Side Slit", price: 100 },
  { id: "hidden-slit", name: "Hidden Side Slit", price: 150 },
  { id: "contrast-panel", name: "Contrast Side Panel", price: 300 },
];

// ================================================================
// SECTION 15 — BOTTOM / HEM DESIGN
// ================================================================
export const BOTTOM_STYLES = [
  { id: "straight", name: "Straight", price: 0 },
  { id: "rounded", name: "Rounded", price: 100 },
  { id: "double-hem", name: "Double Hem", price: 150 },
  { id: "contrast-hem", name: "Contrast Hem", price: 250 },
  { id: "premium", name: "Premium Hem", price: 300 },
];

// ================================================================
// SECTION 16 — STITCHING
// ================================================================
export const STITCHING_STYLES = [
  { id: "matching", name: "Matching Stitch", price: 0 },
  { id: "contrast", name: "Contrast Stitch", price: 200 },
  { id: "double", name: "Double Stitch", price: 150 },
  { id: "premium", name: "Premium Stitch", price: 300 },
];

export const STITCH_COLORS = [
  { id: "matching", name: "Matching", hex: null },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
  { id: "gold", name: "Gold", hex: "#C8A96B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
];

// ================================================================
// SECTION 17 — EMBROIDERY
// ================================================================
export const EMBROIDERY_TYPES = [
  { id: "none", name: "No Embroidery", price: 0 },
  { id: "minimal", name: "Minimal Embroidery", price: 300 },
  { id: "collar", name: "Collar Embroidery", price: 500 },
  { id: "chest", name: "Chest Embroidery", price: 600 },
  { id: "cuff", name: "Cuff Embroidery", price: 400 },
  { id: "custom", name: "Custom Embroidery", price: 1000 },
];

export const EMBROIDERY_COLORS = [
  { id: "matching", name: "Matching", hex: null },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
  { id: "gold", name: "Gold", hex: "#C8A96B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
];

// ================================================================
// SECTION 18 — MONOGRAM
// ================================================================
export const MONOGRAM_PLACEMENTS = [
  { id: "chest", name: "Chest", price: 300 },
  { id: "cuff", name: "Cuff", price: 250 },
  { id: "sleeve", name: "Sleeve", price: 250 },
  { id: "pocket", name: "Pocket", price: 200 },
];

export const MONOGRAM_COLORS = [
  { id: "gold", name: "Gold", hex: "#C8A96B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
];

// ================================================================
// SECTION 19 — FABRIC & COLOR
// ================================================================
export const FABRICS = [
  { id: "premium-cotton", name: "Premium Cotton", price: 500, color: "#FAF9F6", texture: "smooth", origin: "Egypt" },
  { id: "cotton-blend", name: "Cotton Blend", price: 300, color: "#F7F3EA", texture: "smooth", origin: "Pakistan" },
  { id: "linen", name: "Linen", price: 800, color: "#EFE8DC", texture: "textured", origin: "Ireland" },
  { id: "premium-linen", name: "Premium Linen", price: 1500, color: "#E8DFD0", texture: "textured", origin: "Ireland" },
  { id: "luxury-blend", name: "Luxury Blend", price: 2000, color: "#F7F3EA", texture: "luxurious", origin: "Italy" },
  { id: "other", name: "Other", price: 0, color: "#FFFFFF", texture: "smooth", origin: "Custom" },
];

export const FABRIC_COLORS = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "off-white", name: "Off White", hex: "#FAF9F6" },
  { id: "cream", name: "Cream", hex: "#F7F3EA" },
  { id: "beige", name: "Beige", hex: "#E8DFD0" },
  { id: "sand", name: "Sand", hex: "#D8C3A5" },
  { id: "grey", name: "Grey", hex: "#A9A9A9" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
  { id: "navy", name: "Navy", hex: "#1B2A4E" },
  { id: "olive", name: "Olive", hex: "#6B7250" },
  { id: "brown", name: "Brown", hex: "#6B4423" },
  { id: "maroon", name: "Maroon", hex: "#6B1F1F" },
  { id: "other", name: "Other", hex: "#C8A96B" },
];

// ================================================================
// CONTRAST COLORS (for sections 04, 11, 12, 13)
// ================================================================
export const CONTRAST_COLORS = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1F1F1F" },
  { id: "gold", name: "Gold", hex: "#C8A96B" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
  { id: "navy", name: "Navy", hex: "#1B2A4E" },
  { id: "maroon", name: "Maroon", hex: "#6B1F1F" },
  { id: "brown", name: "Brown", hex: "#6B4423" },
  { id: "olive", name: "Olive", hex: "#6B7250" },
];

// ================================================================
// PRICE CALCULATION
// ================================================================
export function calculatePrice(config) {
  let total = BASE_PRICE;

  // Fit
  const fit = FITS.find((f) => f.id === config.fit);
  if (fit) total += fit.price;

  // Collar
  const collar = COLLAR_TYPES.find((c) => c.id === config.collarType);
  if (collar) total += collar.price;
  const collarH = COLLAR_HEIGHTS.find((c) => c.id === config.collarHeight);
  if (collarH) total += collarH.price;
  const collarF = COLLAR_FINISHES.find((c) => c.id === config.collarFinish);
  if (collarF) total += collarF.price;

  // Collar Contrast
  const cContrast = CONTRAST_OPTIONS.find((c) => c.id === config.collarContrast);
  if (cContrast) total += cContrast.price;

  // Placket
  const placket = PLACKETS.find((p) => p.id === config.placket);
  if (placket) total += placket.price;

  // Buttons
  const buttonStyle = BUTTON_STYLES.find((b) => b.id === config.buttonStyle);
  if (buttonStyle) total += buttonStyle.price;

  // Sleeve
  const sleeve = SLEEVES.find((s) => s.id === config.sleeve);
  if (sleeve) total += sleeve.price;

  // Cuff
  const cuff = CUFFS.find((c) => c.id === config.cuff);
  if (cuff) total += cuff.price;

  // Cuff Button
  const cuffBtn = CUFF_BUTTONS.find((c) => c.id === config.cuffButton);
  if (cuffBtn) total += cuffBtn.price;

  // Chest Pocket
  const chestP = CHEST_POCKETS.find((p) => p.id === config.chestPocket);
  if (chestP) total += chestP.price;

  // Side Pocket
  const sideP = SIDE_POCKETS.find((p) => p.id === config.sidePocket);
  if (sideP) total += sideP.price;

  // Pocket Style
  const pocketStyle = POCKET_STYLES.find((p) => p.id === config.pocketStyle);
  if (pocketStyle) total += pocketStyle.price;

  // Pocket Contrast
  const pc = POCKET_CONTRAST.find((p) => p.id === config.pocketContrast);
  if (pc) total += pc.price;

  // Sleeve Contrast
  const sc = SLEEVE_CONTRAST.find((s) => s.id === config.sleeveContrast);
  if (sc) total += sc.price;

  // Placket Contrast
  const plc = PLACKET_CONTRAST.find((p) => p.id === config.placketContrast);
  if (plc) total += plc.price;

  // Side
  const side = SIDE_DESIGNS.find((s) => s.id === config.sideDesign);
  if (side) total += side.price;

  // Bottom
  const bottom = BOTTOM_STYLES.find((b) => b.id === config.bottomStyle);
  if (bottom) total += bottom.price;

  // Stitching
  const stitch = STITCHING_STYLES.find((s) => s.id === config.stitchingStyle);
  if (stitch) total += stitch.price;

  // Embroidery
  const emb = EMBROIDERY_TYPES.find((e) => e.id === config.embroidery);
  if (emb) total += emb.price;

  // Monogram
  if (config.monogramText) {
    const mono = MONOGRAM_PLACEMENTS.find((m) => m.id === config.monogramPlacement);
    if (mono) total += mono.price;
  }

  // Fabric
  const fabric = FABRICS.find((f) => f.id === config.fabric);
  if (fabric) total += fabric.price;

  // Measurement / Custom fitting
  total += 500;

  return total;
}

// ================================================================
// DESIGN ID
// ================================================================
export function generateDesignId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "THB-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
