"use client";
import { BOTTOM_STYLES, CONTRAST_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step15Bottom({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {BOTTOM_STYLES.map((b) => (
          <button key={b.id} onClick={() => updateConfig("bottomStyle", b.id)}
            className={`text-left p-3 border text-xs ${config.bottomStyle === b.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-charcoal">{b.name}</span>
              {config.bottomStyle === b.id && <Check size={12} className="text-gold" />}
            </div>
            {b.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(b.price)}</span>}
          </button>
        ))}
      </div>

      {config.bottomStyle === "contrast-hem" && (
        <>
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Contrast Color</p>
            <div className="flex flex-wrap gap-2">
              {CONTRAST_COLORS.map((c) => (
                <button key={c.id} onClick={() => updateConfig("bottomContrastColor", c.id)}
                  className={`w-10 h-10 border-2 ${config.bottomContrastColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                  style={{ backgroundColor: c.hex }} title={c.name} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
