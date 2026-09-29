"use client";
import { CONTRAST_OPTIONS, CONTRAST_COLORS, FABRICS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step04CollarContrast({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {CONTRAST_OPTIONS.map((c) => (
          <button key={c.id} onClick={() => updateConfig("collarContrast", c.id)}
            className={`text-left p-3 border transition-all ${config.collarContrast === c.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal">{c.name}</span>
              {config.collarContrast === c.id && <Check size={12} className="text-gold" />}
            </div>
            {c.price > 0 && <p className="text-[10px] text-gold mt-1">+ {formatPrice(c.price)}</p>}
          </button>
        ))}
      </div>

      {(config.collarContrast === "contrast-color" || config.collarContrast === "contrast-fabric") && (
        <>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Contrast Color</p>
            <div className="flex flex-wrap gap-2">
              {CONTRAST_COLORS.map((c) => (
                <button key={c.id} onClick={() => updateConfig("collarContrastColor", c.id)}
                  className={`w-10 h-10 border-2 transition-all ${config.collarContrastColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                  style={{ backgroundColor: c.hex }} title={c.name} />
              ))}
            </div>
          </div>

          {config.collarContrast === "contrast-fabric" && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Contrast Fabric</p>
              <select value={config.collarContrastFabric} onChange={(e) => updateConfig("collarContrastFabric", e.target.value)}
                className="w-full p-3 border border-border focus:border-gold outline-none text-sm bg-white">
                <option value="">Select fabric</option>
                {FABRICS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}
