import { create } from "zustand";
import { calculatePrice, generateDesignId } from "@/config/customThobe";

const DEFAULT_CONFIG = {
  // ===== MEASUREMENTS (Section 01) =====
  measurements: {
    thobeLength: "",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeveLength: "",
    bicep: "",
    wrist: "",
    neck: "",
    bottomOpening: "",
    sideSlitLength: "",
  },

  // ===== FIT (Section 02) =====
  fit: "regular",

  // ===== COLLAR (Section 03) =====
  collarType: "mandarin",
  collarHeight: "medium",
  collarFinish: "standard",

  // ===== COLLAR CONTRAST (Section 04) =====
  collarContrast: "none",
  collarContrastColor: "white",
  collarContrastFabric: "",

  // ===== PLACKET (Section 05) =====
  placket: "hidden",

  // ===== BUTTONS (Section 06) =====
  buttonStyle: "normal-hole",
  buttonColor: "matching",

  // ===== SLEEVE (Section 07) =====
  sleeve: "straight",

  // ===== CUFF (Section 08) =====
  cuff: "standard",

  // ===== CUFF BUTTON (Section 09) =====
  cuffButton: "normal",
  cuffButtonColor: "matching",

  // ===== POCKETS (Section 10) =====
  chestPocket: "none",
  sidePocket: "none",
  pocketStyle: "hidden",

  // ===== POCKET CONTRAST (Section 11) =====
  pocketContrast: "no",
  pocketContrastColor: "white",

  // ===== SLEEVE CONTRAST (Section 12) =====
  sleeveContrast: "none",
  sleeveContrastColor: "white",

  // ===== PLACKET CONTRAST (Section 13) =====
  placketContrast: "none",
  placketContrastColor: "white",

  // ===== SIDE DESIGN (Section 14) =====
  sideDesign: "plain",
  sideSlitLength: "12",

  // ===== BOTTOM / HEM (Section 15) =====
  bottomStyle: "straight",
  bottomContrast: "no",
  bottomContrastColor: "white",

  // ===== STITCHING (Section 16) =====
  stitchingStyle: "matching",
  stitchColor: "matching",

  // ===== EMBROIDERY (Section 17) =====
  embroidery: "none",
  embroideryColor: "matching",

  // ===== MONOGRAM (Section 18) =====
  monogramText: "",
  monogramPlacement: "chest",
  monogramColor: "gold",

  // ===== FABRIC & COLOR (Section 19) =====
  fabric: "premium-cotton",
  fabricColor: "white",

  // ===== SPECIAL REQUEST (Section 20) =====
  specialRequest: "",

  // ===== CONFIRMATIONS (Section 21) =====
  confirmMeasurements: false,
  confirmFitting: false,
  confirmChecked: false,
};

export const useCustomizerStore = create((set, get) => ({
  currentStep: 0,
  config: { ...DEFAULT_CONFIG },
  designId: null,
  loading: false,
  savedDesigns: [],

  // ===== NAVIGATION =====
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 21) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  // ===== CONFIG UPDATE =====
  updateConfig: (key, value) =>
    set((state) => ({
      config: { ...state.config, [key]: value },
    })),

  updateMeasurement: (key, value) =>
    set((state) => ({
      config: {
        ...state.config,
        measurements: { ...state.config.measurements, [key]: value },
      },
    })),

  // ===== RESET =====
  resetConfig: () =>
    set({
      config: { ...DEFAULT_CONFIG },
      currentStep: 0,
      designId: null,
    }),

  // ===== LOAD EXISTING DESIGN =====
  loadDesign: (designId, config) =>
    set({ designId, config: { ...DEFAULT_CONFIG, ...config } }),

  // ===== DESIGN ID =====
  generateId: () => {
    const id = generateDesignId();
    set({ designId: id });
    return id;
  },

  setDesignId: (id) => set({ designId: id }),

  // ===== PRICE =====
  getPrice: () => calculatePrice(get().config),
}));
