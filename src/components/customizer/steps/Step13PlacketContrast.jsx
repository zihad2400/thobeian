"use client";
import { PLACKET_CONTRAST, CONTRAST_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step13PlacketContrast({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {PLACKET_CONTRAST.map((c) => (
          <button key={c.id} onClick={() => updateConfig("placketContrast", c.id)}
            className={`text-left p-3 border text-xs ${config.placketContrast === c.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-charcoal">{c.name}</span>
              {config.placketContrast === c.id && <Check size={12} className="text-gold" />}
            </div>
            {c.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(c.price)}</span>}
          </button>
        ))}
      </div>

      {config.placketContrast !== "none" && (
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Contrast Color</p>
          <div className="flex flex-wrap gap-2">
            {CONTRAST_COLORS.map((c) => (
              <button key={c.id} onClick={() => updateConfig("placketContrastColor", c.id)}
                className={`w-10 h-10 border-2 ${config.placketContrastColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
