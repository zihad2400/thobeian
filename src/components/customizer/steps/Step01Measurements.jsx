"use client";

const FIELDS = [
  { key: "thobeLength", label: "Total Thobe Length", example: "56", desc: "From shoulder to desired bottom length" },
  { key: "chest", label: "Chest / বুক", example: "42", desc: "Around the fullest part of the chest" },
  { key: "waist", label: "Waist / কোমর", example: "40", desc: "Around the natural waist" },
  { key: "hip", label: "Hip / নিতম্ব", example: "44", desc: "Around the fullest part of hips" },
  { key: "shoulder", label: "Shoulder / শোল্ডার", example: "18", desc: "One shoulder point to the other" },
  { key: "sleeveLength", label: "Sleeve Length / হাতার লম্বা", example: "24", desc: "Shoulder point to wrist" },
  { key: "bicep", label: "Arm / Bicep", example: "15", desc: "Around the upper arm" },
  { key: "wrist", label: "Wrist / কবজি", example: "8", desc: "Around the wrist" },
  { key: "neck", label: "Neck / গলা", example: "16", desc: "Around the neck comfortably" },
  { key: "bottomOpening", label: "Bottom Opening / নিচের ঘের", example: "24", desc: "Desired bottom width" },
  { key: "sideSlitLength", label: "Side Slit Length", example: "12", desc: "Desired side slit length" },
];

export default function Step01Measurements({ config, updateMeasurement }) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gold/5 border border-gold/30 text-xs text-charcoal">
        📏 Please enter all measurements in <strong>inches</strong>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-charcoal mb-1">
              {field.label}
            </label>
            <p className="text-[10px] text-text-muted mb-2">{field.desc}</p>
            <div className="relative">
              <input
                type="number"
                value={config.measurements[field.key] || ""}
                onChange={(e) => updateMeasurement(field.key, e.target.value)}
                placeholder={`Example: ${field.example}`}
                className="w-full px-3 py-2.5 pr-14 border border-border focus:border-gold outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                inch
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
