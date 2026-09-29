"use client";
import { BUTTON_STYLES, BUTTON_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step06Buttons({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Button Style</p>
        <div className="grid grid-cols-2 gap-3">
          {BUTTON_STYLES.map((b) => (
            <button key={b.id} onClick={() => updateConfig("buttonStyle", b.id)}
              className={`text-left p-3 border transition-all ${config.buttonStyle === b.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-charcoal">{b.name}</span>
                {config.buttonStyle === b.id && <Check size={12} className="text-gold" />}
              </div>
              {b.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(b.price)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Button Color</p>
        <div className="flex flex-wrap gap-2">
          {BUTTON_COLORS.map((c) => (
            <button key={c.id} onClick={() => updateConfig("buttonColor", c.id)}
              className={`w-11 h-11 border-2 transition-all flex items-center justify-center text-[10px] relative ${config.buttonColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
              style={{ backgroundColor: c.hex || "#EEE" }} title={c.name}>
              {config.buttonColor === c.id && <Check size={12} className={c.id === "white" ? "text-charcoal" : "text-white"} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
