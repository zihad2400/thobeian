"use client";
import { CUFF_BUTTONS, BUTTON_COLORS } from "@/config/customThobe";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Step09CuffButton({ config, updateConfig }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {CUFF_BUTTONS.map((c) => (
          <button key={c.id} onClick={() => updateConfig("cuffButton", c.id)}
            className={`text-left p-3 border transition-all ${config.cuffButton === c.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-charcoal">{c.name}</span>
              {config.cuffButton === c.id && <Check size={12} className="text-gold" />}
            </div>
            {c.price > 0 && <span className="text-[10px] text-gold">+ {formatPrice(c.price)}</span>}
          </button>
        ))}
      </div>

      {config.cuffButton !== "none" && (
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Button Color</p>
          <div className="flex flex-wrap gap-2">
            {BUTTON_COLORS.map((c) => (
              <button key={c.id} onClick={() => updateConfig("cuffButtonColor", c.id)}
                className={`w-11 h-11 border-2 transition-all flex items-center justify-center ${config.cuffButtonColor === c.id ? "border-gold" : "border-border hover:border-gold/50"}`}
                style={{ backgroundColor: c.hex || "#EEE" }} title={c.name}>
                {config.cuffButtonColor === c.id && <Check size={12} className={c.id === "white" || c.id === "matching" ? "text-charcoal" : "text-white"} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
